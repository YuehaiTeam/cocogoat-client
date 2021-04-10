<script>
import { watch } from 'vue'
import { sleep } from './utils'
import { ipcRenderer } from 'electron'
import { status, STATUS } from './status'
import { recognizeArtifact } from './recognizeArtifact'
import { split, imageDump } from './imageProcess'
import { getposition, capture, getActiveWindow, sendToAppWindow } from './ipc'

import AppHeader from './Components/AppHeader'
import Capture from './Components/Capture/Index'
export default {
    components: {
        AppHeader,
        Capture,
    },
    data() {
        return {
            activeWindow: '',
            intro: true,
        }
    },
    computed: {
        status() {
            return status
        },
    },
    async created() {
        window.$vm = this
        ipcRenderer.on('keydown', this.onKeydown)
        ipcRenderer.on('mouseup', this.onMouseup)
        this._watchauto = watch(
            () => status.auto,
            () => {
                this.activeWindow = ''
            },
        )
        ipcRenderer.send('readyArtifactView')
        ipcRenderer.on('tryocr', async (event, { id }) => {
            await this.processWithTimeout()
            ipcRenderer.sendTo(event.senderId, `tryocr-${id}`)
        })
    },
    beforeUnmount() {
        this._watchauto()
        ipcRenderer.off('keydown', this.onKeydown)
        ipcRenderer.off('mouseup', this.onMouseup)
    },
    methods: {
        onKeydown(src, event) {
            if (event.keycode === status.hotkey) {
                switch (status.status) {
                    case STATUS.INTRO:
                        this.startCapture()
                        break
                    default:
                        if (event.altKey) {
                            status.auto = !status.auto
                        } else if (event.metaKey) {
                            this.processWithTimeout()
                        }
                }
            }
        },
        async onMouseup(src, event) {
            await sleep(50)
            if (status.status > STATUS.INTRO && event.button === 1 && status.auto) {
                const { windowPid, windowName } = await getActiveWindow()
                const currentWin = windowPid + windowName
                if (this.activeWindow !== '' && currentWin !== this.activeWindow) {
                    status.auto = false
                } else {
                    this.processWithTimeout()
                }
                this.activeWindow = currentWin
            }
        },
        async processWithTimeout() {
            if (status.status === STATUS.LOADING) return
            status.status = STATUS.LOADING
            await sleep(80)
            try {
                const [result] = await Promise.all([this.processOnce(), sleep(200)])
                status.status = STATUS.SUCCESS
                return result
            } catch (e) {
                console.log(e)
                status.status = STATUS.ERROR
            }
        },
        splitImages(canvas) {
            const posObj = this.$refs.captureDom.getPosition()
            return split(canvas, posObj)
        },
        async processOnce() {
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

            /* 拆分、预处理 */
            let ret = this.splitImages(canvas)

            /* 调试写入图片文件 */
            if (status.runtimeDebug) {
                await imageDump(canvas, ret)
            }

            /* OCR、识别 */
            const [artifact, potentialErrors] = await recognizeArtifact(ret)
            status.artifact = artifact
            status.potentialErrors = potentialErrors

            console.log(JSON.parse(JSON.stringify(status.artifact)))
            console.log(JSON.parse(JSON.stringify(status.potentialErrors)))

            this.saveToMain()
        },
        async saveToMain() {
            status.artifactBackup = JSON.parse(JSON.stringify(status.artifact))
            sendToAppWindow('artifactPush', JSON.parse(JSON.stringify(status.artifact)))
        },
        async onModify() {
            this.saveToMain()
            status.status = STATUS.MODIFIED
            status.potentialErrors = []
        },
        async onDelete() {
            sendToAppWindow('artifactDelete', { id: status.artifact.id })
            status.status = STATUS.DELETED
            status.potentialErrors = []
        },
        async onReset() {
            if (status.artifactBackup) {
                status.artifact = JSON.parse(JSON.stringify(status.artifactBackup))
            }
        },
    },
}
</script>

<template>
    <app-header @clickprocess="processWithTimeout" />
    <div class="app-main">
        <capture ref="captureDom" @start="processWithTimeout" @modify="onModify" @delete="onDelete" @reset="onReset" />
    </div>
</template>
<style lang="scss">
@import '~@/styles/fonts.scss';
* {
    font-family: GenshinImpact;
}
</style>
<style lang="scss" scoped>
.app-main {
    position: absolute;
    top: 30px;
    left: 2px;
    right: 2px;
    bottom: 2px;
}
</style>
