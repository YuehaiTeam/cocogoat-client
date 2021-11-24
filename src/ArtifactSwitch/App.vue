<script>
import { v4 as uuid } from 'uuid'
import { __ } from '@/i18n'
import { ipcRenderer } from 'electron'
import Actions from './Components/Actions'
import AppHeader from './Components/AppHeader'
import TransparentArea from './Components/TransparentArea'
import {
    getposition,
    capture,
    setTransparent,
    tryocr,
    tryocrSec,
    click,
    joystickStatus,
    joystickNext,
    syncArtifact,
    getArtifactViewWindowId,
} from './ipc'
import { bus, STATUS } from './bus'
import { imageDump, getBlocks, toWindowPos } from './imageProcess'
import { santizeBlocks, getBlockCenter } from './postRecognize'
import { sleep } from '@/ArtifactView/utils'
import { ElMessageBox } from 'element-plus'
import { sendToAppWindow } from '@/ArtifactView/ipc'
let sleepRatio = 1
const lockTime = 250 // 等待至少250毫秒，确认锁的动画已经结束
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
        if (!bus.options.artifacts.fastScroll) {
            sleepRatio = 3
        }
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
        async getCanvas(ww, hh) {
            await sleep(10 * sleepRatio)
            /* 计算窗口位置 */
            const p = window.devicePixelRatio
            let [x, y] = await getposition()
            x = x * p
            y = y * p
            const w = ww || window.innerWidth
            const h = hh || window.innerHeight

            /* 抓屏 */
            let canvas = await capture(x, y, w * p, h * p)

            /* 高dpi缩放 */
            if (p !== 1) {
                let srcCanvas = canvas
                canvas = document.createElement('canvas')
                canvas.width = w
                canvas.height = h
                const ctx = canvas.getContext('2d')
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
            await sleep(20 * sleepRatio)

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
            bus.devmsg = 'paging:start'
            setTransparent(true)
            const { x, y } = getBlockCenter(orig)
            // 设置焦点
            await click(await toWindowPos(x, y))
            await sleep(10 * sleepRatio)
            let time = 0

            // 按平均值先进行快速滚动
            if (avgTimes && bus.options.artifacts.fastScroll) {
                while (time < avgTimes * 0.5) {
                    time++
                    ipcRenderer.send('scrollTick', false)
                }
            } else {
                // 否则只发送一次
                time++
                ipcRenderer.send('scrollTick', false)
            }
            // 延时等待抓屏
            await sleep(30 * sleepRatio)
            while (true) {
                time++
                if (!bus.auto) {
                    return
                }
                // 首次有上方首次延时，后面有opencv处理延迟填充，保证抓屏时界面展示已经完成
                // 减少抓屏区域以提高效率
                const canvas = await this.getCanvas(
                    (window.innerWidth / bus.cols) * 1.5,
                    (window.innerHeight / bus.rows) * 2 + 84,
                )
                new Image().src = canvas.toDataURL()
                // 抓图成功后马上发送下一次
                ipcRenderer.send('scrollTick', false)
                let blocks
                const getImage = (async () => {
                    blocks = santizeBlocks(await getBlocks(canvas), {
                        width: window.innerWidth,
                        height: window.innerHeight,
                    }).blocks
                })()
                // 用opencv处理时间填充抓屏延迟
                await Promise.all([getImage, sleep(30 * sleepRatio)])
                // 处理本次数据
                const curr = blocks[0]
                if (!middlePassed && curr.y <= orig.y - orig.height - 1) {
                    middlePassed = true
                    bus.devmsg = 'paging:middle'
                    console.log('paging:middle', curr)
                } else if (middlePassed && Math.abs(curr.y - orig.y) <= (orig.height * 2) / 3) {
                    bus.devmsg = ''
                    // 由于预先发送滚轮，这里回头一次
                    ipcRenderer.send('scrollTick', true)
                    await sleep(30 * sleepRatio)
                    // 等待滚轮响应
                    console.log('page done', curr, orig)
                    break
                } else if (avgTimes > 0 && time >= avgTimes * 2) {
                    // 1.5倍次数还没到，看来是到底了
                    console.log('paging:last', curr)
                    return false
                } else {
                    console.log('paging:start', curr)
                }
            }
            if (revertStatus) {
                bus.status = STATUS.WAITING
                setTransparent(false)
                try {
                    this.detectOnce()
                } catch (e) {}
            }
            return time
        },
        async checkLock(artifact, callback, args) {
            if (!artifact) return
            let syncedArtifact = await syncArtifact(artifact)
            if (!syncedArtifact) return
            if (syncedArtifact.lock !== artifact.lock) {
                await callback(args)
            }
        },
        async auto(autoLock = false) {
            if (await joystickStatus()) {
                return await this.autoByJoystick(autoLock)
            } else {
                return await this.autoByMouse(autoLock)
            }
        },
        async autoByJoystick(autoLock) {
            bus.status = STATUS.JOYSTICK
            try {
                bus.auto = true
                bus.totalCount = 0
                bus.isLastPage = 0
                bus.checkedCount = 0
                bus.currentCount = 0
                setTransparent(true)
                // 设置焦点
                await click(await toWindowPos(100, 100))
                setTransparent(false)
                const cache = []
                const cacheIds = []
                while (bus.auto) {
                    bus.checkedCount++
                    let artifact = await tryocr()
                    if (autoLock) await this.checkLock(artifact, Promise.resolve()) // TODO press L3
                    await joystickNext()
                    await sleep(60 * sleepRatio)
                    try {
                        const prefix = `${artifact.name}-${artifact.level}-${artifact.main.name}-${artifact.main.value}-${artifact.stars}`
                        const subs = artifact.sub.map((s) => `${s.name}-${s.value}`)
                        cache.push([prefix, ...subs].join('_'))
                        cacheIds.push(artifact.id)
                    } catch (e) {}
                    while (cache.length > 4) {
                        cache.shift()
                        cacheIds.shift()
                    }

                    if (cache.length < 4) {
                        continue
                    }
                    const set = new Set(cache)
                    if (set.size <= 1) {
                        // 连续四次检测只有1种结果 可以认为是结束了
                        if (bus.options.artifacts.keepSameArtifacts) {
                            // 若保留重复，需要删掉多出来的
                            for (let i = 1; i < cacheIds.length; i++) {
                                console.log('del', cacheIds[i])
                                sendToAppWindow('artifactDelete', { id: cacheIds[i] })
                                bus.checkedCount--
                            }
                        }
                        break
                    }
                }
                bus.auto = false
                bus.status = bus.READY
            } catch (e) {
                console.log(e)
                bus.auto = false
                bus.status = bus.ERROR
            }
        },
        async autoByMouse(autoLock) {
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
                    await this.clickAllLines(autoLock)
                    let i = bus.rows
                    while (!bus.isLastPage && i > 0) {
                        const p = await this.nextPage(false, orig, avgTimes)
                        if (p > 0) {
                            if (!avgTimes) avgTimes = p
                            i--
                        } else {
                            bus.isLastPage = true
                        }
                    }
                    await this.detectOnce(false, false)
                    if (bus.isLastPage) {
                        console.log('isLastPage')
                        bus.status = STATUS.CLICK
                        await this.clickOtherLine(i, autoLock)
                        break
                    }
                }
                bus.auto = false
                bus.status = bus.READY
            } catch (e) {
                console.log(e)
                bus.auto = false
                bus.status = bus.ERROR
            }
        },
        async lockBack(args) {
            const [x, y, lastx, lasty] = args
            const sleepTime = 500 // now set fixed 500ms to wait
            await click(await toWindowPos(lastx, lasty))
            await sleep(sleepTime)
            const id = uuid()
            const artifactViewId = await getArtifactViewWindowId()
            ipcRenderer.sendTo(artifactViewId, 'clickLock', { id })
            await new Promise((resolve) => {
                ipcRenderer.once(`clickLock-${id}`, (result, data) => resolve(data))
            })
            await click(await toWindowPos(x, y))
            await sleep(sleepTime)
        },
        async clickFirstLine(autoLock) {
            let { x, y } = getBlockCenter(bus.blocks[0])
            let ocrPromise = Promise.resolve()
            for (let i = 0; i < bus.cols; i++) {
                if (!bus.auto) return
                await click(await toWindowPos(x, y))
                // 延时等待抓屏
                const [artifact] = await Promise.all([ocrPromise, sleep(lockTime + 50 * sleepRatio)])
                if (autoLock) await this.checkLock(artifact, this.lockBack, [x, y, x - bus.blockWidth, y])
                bus.checkedCount++
                const [p, q] = await tryocrSec()
                await p
                ocrPromise = q
                await sleep(bus.options.artifacts.autoSwitchDelay * 1e3)
                x += bus.blockWidth
            }
            if (autoLock) {
                const artifact = await ocrPromise
                await this.checkLock(artifact, this.lockBack, [x, y, x - bus.blockWidth, y])
            }
        },
        async clickOtherLine(n, autoLock) {
            let ocrPromise = Promise.resolve()
            let lastx = 0
            let lasty = 0
            for (let i = n * bus.cols; i < bus.blocks.length; i++) {
                if (!bus.auto) return
                const { x, y } = getBlockCenter(bus.blocks[i])
                await click(await toWindowPos(x, y))
                // 延时等待抓屏
                const [artifact] = await Promise.all([ocrPromise, sleep(lockTime + 50 * sleepRatio)])
                if (autoLock) await this.checkLock(artifact, this.lockBack, [x, y, lastx, lasty])
                bus.checkedCount++
                const [p, q] = await tryocrSec()
                await p
                ocrPromise = q
                await sleep(bus.options.artifacts.autoSwitchDelay * 1e3)
                lastx = x
                lasty = y
            }
            if (autoLock) {
                const artifact = await ocrPromise
                await this.checkLock(artifact, this.lockBack, [lastx, lasty, lastx, lasty])
            }
        },
        async clickAllLines(autoLock) {
            let ocrPromise = Promise.resolve()
            let lastx = 0
            let lasty = 0
            for (let i = 0; i < bus.blocks.length; i++) {
                console.log(i)
                if (!bus.auto) return
                const { x, y } = getBlockCenter(bus.blocks[i])
                await click(await toWindowPos(x, y))
                // 延时等待抓屏
                const [artifact] = await Promise.all([ocrPromise, sleep(lockTime, 50 * sleepRatio)])
                if (autoLock) await this.checkLock(artifact, this.lockBack, [x, y, lastx, lasty])
                bus.checkedCount++
                const [p, q] = await tryocrSec()
                await p
                ocrPromise = q
                await sleep(bus.options.artifacts.autoSwitchDelay * 1e3)
                lastx = x
                lasty = y
            }
            if (autoLock) {
                const artifact = await ocrPromise
                await this.checkLock(artifact, this.lockBack, [lastx, lasty, lastx, lasty])
            }
        },
        async onDetect() {
            try {
                await this.detectOnce()
            } catch (e) {}
            bus.intro = false
        },
        async onAuto() {
            this.auto()
        },
        async onLock() {
            this.auto(true)
        },
    },
}
</script>
<template>
    <app-header />
    <actions @detectonce="onDetect" @startauto="onAuto" @pagedown="nextPage" @startlock="onLock" />
    <transparent-area />
</template>
<style lang="scss">
@import '~@/styles/fonts.scss';
* {
    font-family: GenshinImpact;
}
</style>
<style lang="scss" scoped></style>
