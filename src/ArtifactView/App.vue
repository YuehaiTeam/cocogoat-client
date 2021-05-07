<script>
import { watch } from 'vue'
import { __ } from '@/i18n'
import { sleep } from './utils'
import { ipcRenderer } from 'electron'
import { status, STATUS } from './status'
import { ElMessageBox } from 'element-plus'
import { recognizeArtifact } from './recognizeArtifact'
import { split, imageDump } from './imageProcess'
import { getposition, capture, getActiveWindow, sendToAppWindow } from './ipc'

import { sendWrongOCRFeedback } from '@/api/feedback'

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
            feedbackVisible: false,
            feedbackContent: '',
            feedbackLoading: false,
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
                        this.processWithTimeout()
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
            try {
                const result = await this.processOnce()
                status.status = STATUS.SUCCESS
                return result
            } catch (e) {
                console.log(e)
                status.status = STATUS.ERROR
            }
        },
        splitImages(canvas, scale) {
            const posObj = this.$refs.captureDom.getPosition()
            return split(canvas, posObj, scale)
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

            /* 拆分、预处理 */
            let ret = this.splitImages(canvas, p)

            /* 调试写入图片文件 */
            if (status.runtimeDebug) {
                imageDump(canvas, ret)
            }

            /* OCR、识别 */
            const [artifact, potentialErrors, ocrResult] = await recognizeArtifact(ret)
            status.artifact = artifact
            status.potentialErrors = potentialErrors
            this.saveToMain()
            ;(async () => {
                console.log(artifact, ocrResult)
                const wrongReportData = JSON.parse(
                    JSON.stringify({
                        artifact,
                        screenshot: '',
                        message: '',
                        ocrResult: {},
                        splitImages: {},
                        version: status.version,
                        build: status.build,
                    }),
                )
                for (let i in ocrResult) {
                    if ({}.hasOwnProperty.call(ocrResult, i)) {
                        for (let j of ocrResult[i].words) {
                            delete j.line
                            delete j.page
                            delete j.block
                            delete j.paragraph
                        }
                        wrongReportData.ocrResult[i] = ocrResult[i].words
                    }
                }
                const alt = {}
                for (let i of [
                    'availHeight',
                    'availLeft',
                    'availTop',
                    'availWidth',
                    'width',
                    'height',
                    'pixelDepth',
                    'colorDepth',
                ]) {
                    alt[i] = window.screen[i]
                }
                alt.angle = window.screen.orientation.angle
                wrongReportData.screen = alt
                wrongReportData.devicePixelRatio = window.devicePixelRatio
                wrongReportData.windowWidth = window.innerWidth
                wrongReportData.windowHeight = window.innerHeight
                status.wrongReportData = wrongReportData
                status.wrongReportData.screenshot = canvas.toDataURL('image/webp')
                for (const i in ret) {
                    if ({}.hasOwnProperty.call(ret, i)) {
                        if (i === 'color') continue
                        status.wrongReportData.splitImages[i] = ret[i].canvas.toDataURL('image/webp')
                    }
                }
            })()
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
        async onFeedback() {
            this.feedbackContent = ''
            this.feedbackLoading = false
            this.feedbackVisible = true
        },
        async doFeedback() {
            this.feedbackLoading = true
            status.wrongReportData.message = this.feedbackContent
            try {
                const id = await sendWrongOCRFeedback(status.wrongReportData)
                this.feedbackVisible = false
                ElMessageBox({
                    type: 'success',
                    title: __('感谢您的反馈'),
                    message: `${__('数据已提交，我们将尽快检查与改进。')} ID：${id || 0}`,
                })
            } catch (e) {}
            this.feedbackLoading = false
        },
    },
}
</script>

<template>
    <app-header @clickprocess="processWithTimeout" />
    <div class="app-main">
        <capture
            ref="captureDom"
            @start="processWithTimeout"
            @modify="onModify"
            @delete="onDelete"
            @reset="onReset"
            @feedback="onFeedback"
        />
        <el-dialog v-model="feedbackVisible" title="反馈识别错误" width="90%">
            <div class="feedback-desc">
                {{ __('反馈识别信息将会发送以下内容到我们的服务器：') }}
                <ul>
                    <li>- {{ __('本次抓取到的圣遗物图片') }}</li>
                    <li>- {{ __('您设备的屏幕分辨率和dpi') }}</li>
                    <li>- {{ __('本地OCR识别结果与纠错尝试') }}</li>
                    <li>- {{ __('您在下方填写的备注文字信息') }}</li>
                </ul>
                {{ __('若您不主动向我们反馈，这些内容都会在识别下一个圣遗物后被删除。') }}
            </div>
            <el-input
                v-model="feedbackContent"
                type="textarea"
                :placeholder="__('有什么特别的备注吗？也可以留空。')"
            ></el-input>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="feedbackVisible = false">{{ __('取消') }}</el-button>
                    <el-button :loading="feedbackLoading" type="primary" @click="doFeedback">
                        {{ __('发送') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<style lang="scss">
@import '~@/styles/fonts.scss';
* {
    font-family: GenshinImpact;
    overflow: hidden;
}
@media only screen and (-webkit-min-device-pixel-ratio: 1.2) {
    .float {
        zoom: 0.85;
        font-size: 12px;
    }
    .title {
        font-size: 12px;
    }
}
@media only screen and (-webkit-min-device-pixel-ratio: 1.5) {
    .float {
        zoom: 0.72;
        font-size: 13px;
    }
    .title {
        font-size: 12px;
    }
}
.el-overlay {
    top: 30px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    height: auto;
}
.el-message-box {
    max-width: 85%;
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
.feedback-desc {
    margin-top: -30px;
    margin-bottom: 15px;
    ul {
        margin: 7px;
        padding: 0;
        padding-left: 10px;
        li {
            list-style: none;
        }
    }
}
</style>
