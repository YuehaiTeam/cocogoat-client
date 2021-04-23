<script>
import { __ } from '@/i18n'
import { ipcRenderer } from 'electron'
import Actions from './Components/Actions'
import AppHeader from './Components/AppHeader'
import TransparentArea from './Components/TransparentArea'
import { getposition, capture, setTransparent, tryocr, click } from './ipc'
import { bus, STATUS } from './bus'
import { imageDump, getBlocks, toWindowPos } from './imageProcess'
import { santizeBlocks, getBlockCenter } from './postRecognize'
import { sleep } from '@/ArtifactView/utils'
import { ElMessageBox } from 'element-plus'
export default {
    components: {
        Actions,
        AppHeader,
        TransparentArea,
    },
    async created() {
        window.$vm = this
        ipcRenderer.send('readyArtifactSwitch')
        ipcRenderer.on('keydown', this.onKeydown)
        setTransparent(false)
    },
    beforeUnmount() {
        ipcRenderer.off('keydown', this.onKeydown)
    },
    methods: {
        onKeydown(src, event) {
            if (event.keycode === bus.hotkey) {
                bus.auto = false
                setTransparent(false)
            }
        },
        async getCanvas() {
            /* 计算窗口位置 */
            const p = window.devicePixelRatio
            let [x, y] = await getposition()
            x = x * p
            y = y * p
            const w = window.innerWidth
            const h = window.innerHeight

            /* 抓屏 */
            let canvas = await capture(x, y, w * p, h * p)

            /* 高dpi缩放 */
            if (p !== 1) {
                let srcCanvas = canvas
                canvas = document.createElement('canvas')
                canvas.width = w
                canvas.height = h
                const ctx = canvas.getContext('2d')
                ctx.imageSmoothingEnabled = true
                ctx.drawImage(srcCanvas, 0, 0, w, h)
            }
            /* 裁剪 */
            {
                let srcCanvas = canvas
                canvas = document.createElement('canvas')
                canvas.width = w - 4
                canvas.height = h - 2 - 80
                const ctx = canvas.getContext('2d')
                ctx.imageSmoothingEnabled = true
                ctx.drawImage(srcCanvas, 2, 80, w, h, 0, 0, w, h)
            }
            return canvas
        },
        async detectOnce(revertStatus = true, firstRun = true) {
            if (revertStatus) {
                bus.totalCount = 0
                bus.checkedCount = 0
                bus.isLastPage = 0
            }
            bus.status = STATUS.CAPTURE
            await this.$nextTick()
            await sleep(20)

            const canvas = await this.getCanvas()
            /* 获取区块 */
            const { blocks, rows, cols } = santizeBlocks(await getBlocks(canvas), canvas)

            bus.currentCount = blocks.length
            if (blocks.length <= 0) {
                // 完全未识别，推断区域有误
                bus.auto = false
                bus.status = STATUS.ERROR
                ElMessageBox({
                    type: 'error',
                    title: __('检测失败'),
                    message: __('请确保您已经使切换器窗口恰好包围圣遗物列表区域。如始终提示出错，请提交反馈。'),
                })
                throw new Error()
            }
            bus.blocks = blocks
            bus.totalCount += bus.isLastPage ? blocks.length - cols : revertStatus ? blocks.length : cols
            if (firstRun) {
                bus.rows = rows
                bus.cols = cols
                bus.blockWidth = (blocks[cols - 1].x - blocks[0].x) / (cols - 1)
                if (bus.rows * bus.cols !== blocks.length) {
                    // 首屏不满，推断有丢
                    ElMessageBox({
                        type: 'error',
                        title: __('检测失败'),
                        message: __(
                            '无法确认行列数量。请确认圣遗物列表的顶部对齐某一行的顶端，且当前页不是最后一页，或换到暗处并重新打开背包。',
                        ),
                    })
                    bus.auto = false
                    bus.status = STATUS.ERROR
                    throw new Error()
                }
            }

            if (bus.runtimeDebug) {
                new Image().src = canvas.toDataURL()
                imageDump(canvas)
            }
            if (revertStatus) {
                bus.status = STATUS.READY
            }
        },
        async nextPage(revertStatus = true, rawOrig, avgTimes) {
            if (!bus.auto) return
            bus.status = STATUS.PAGING
            const orig = rawOrig || bus.blocks[0]
            let middlePassed = false
            setTransparent(true)
            const { x, y } = getBlockCenter(orig)
            await click(await toWindowPos(x, y))
            await sleep(10)
            let time = 0
            while (true) {
                if (!bus.auto) return
                ipcRenderer.send('scrollTick', false)
                time++
                if (avgTimes && time < avgTimes * 0.6) continue
                await sleep(40)
                const d2 = Date.now()
                let blocks
                const getImage = (async () => {
                    const rawCanvas = await this.getCanvas()
                    const canvas = document.createElement('canvas')
                    canvas.width = (rawCanvas.width / bus.cols) * 2
                    canvas.height = (rawCanvas.height / bus.rows) * 2
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(rawCanvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
                    const { blocks: b } = santizeBlocks(await getBlocks(canvas), rawCanvas)
                    blocks = b
                })()
                await getImage
                console.log('d2', Date.now() - d2)
                const curr = blocks[0]
                if (!middlePassed && curr.y <= orig.y - orig.height - 1) {
                    middlePassed = true
                } else if (middlePassed && Math.abs(curr.y - orig.y) <= 10) {
                    break
                } else if (avgTimes > 0 && time >= avgTimes * 1.5) {
                    // 1.5倍次数还没到，看来是到底了
                    return false
                }
            }
            if (revertStatus) {
                bus.status = STATUS.WAITING
                setTransparent(false)
                this.detectOnce()
            }
            return time
        },
        async auto() {
            try {
                bus.auto = true
                bus.totalCount = 0
                bus.isLastPage = 0
                bus.checkedCount = 0
                bus.currentCount = 0
                let avgTimes = 0
                setTransparent(true)
                await this.detectOnce(false, true)
                const orig = bus.blocks[0]
                while (bus.auto) {
                    bus.status = STATUS.CLICK
                    if (!bus.isLastPage) {
                        await this.clickFirstLine()
                        const p = await this.nextPage(false, orig, avgTimes)
                        if (p > 0) {
                            if (!avgTimes) avgTimes = p
                        } else {
                            bus.isLastPage = true
                        }
                    }
                    await this.detectOnce(false, false)
                    if (bus.isLastPage) {
                        bus.status = STATUS.CLICK
                        await this.clickOtherLine()
                        break
                    }
                }
                bus.auto = false
                bus.status = bus.READY
            } catch (e) {
                bus.auto = false
                bus.status = bus.ERROR
            }
        },
        async clickFirstLine() {
            let { x, y } = getBlockCenter(bus.blocks[0])
            for (let i = 0; i < bus.cols; i++) {
                if (!bus.auto) return
                await click(await toWindowPos(x, y))
                bus.checkedCount++
                const d1 = Date.now()
                await tryocr()
                console.log('d1', Date.now() - d1)
                await sleep(bus.options.artifacts.autoSwitchDelay * 1e3)
                x += bus.blockWidth
            }
        },
        async clickOtherLine() {
            for (let i = bus.cols; i < bus.blocks.length; i++) {
                if (!bus.auto) return
                const { x, y } = getBlockCenter(bus.blocks[i])
                await click(await toWindowPos(x, y))
                bus.checkedCount++
                await tryocr()
                await sleep(bus.options.artifacts.autoSwitchDelay * 1e3)
            }
        },
        async onDetect() {
            await this.detectOnce()
            bus.intro = false
        },
        async onAuto() {
            this.auto()
        },
    },
}
</script>
<template>
    <app-header />
    <actions @detectonce="onDetect" @startauto="onAuto" @pagedown="nextPage" />
    <transparent-area />
</template>
<style lang="scss">
@import '~@/styles/fonts.scss';
* {
    font-family: GenshinImpact;
}
</style>
<style lang="scss" scoped></style>
