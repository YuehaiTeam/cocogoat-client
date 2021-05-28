<script>
import xss from 'xss'
import dayjs from 'dayjs'
import marked from 'marked'
import fsex from 'fs-extra'
import $set from 'lodash/set'
import { upgrade, getApphash, checkViGEmInstalled, openExternal } from '../../ipc'
import { bus } from '@/App/bus'
import { ipcRenderer } from 'electron'
import { latestRelease, checkPatch } from '@/api/upgrade'
import { ElLoading, ElMessageBox, ElNotification } from 'element-plus'
import { version_compare } from '@/plugins/version_compare'
import { EBuild } from '@/typings/config'
import { joystickStatus } from '@/ArtifactSwitch/ipc'
import { __ } from '@/i18n'
export default {
    async beforeRouteEnter(to, fr, next) {
        const joystick = await joystickStatus()
        next((vm) => {
            vm.joystick = joystick
        })
    },
    data() {
        return {
            clickTimes: 0,
            runtimeDebug: false,
            showUpgrade: false,
            newVersion: false,
            versionHTML: '',
            upgradeButtonLoading: false,
            joystick: false,
        }
    },
    computed: {
        bus() {
            return bus
        },
        options() {
            return bus.config.options
        },
        buildTime() {
            return dayjs(bus.config.build.timestamp).format('YYMMDDHHmm')
        },
    },
    methods: {
        opt(k, v) {
            $set(bus.config.options, k, v)
        },
        async checkUpgrade() {
            this.upgradeButtonLoading = true
            try {
                let buildType = ''
                if (bus.config.build?.type === EBuild.DEV) {
                    buildType = `.${bus.config.build?.timestamp}dev`
                } else if (bus.config.build?.type === EBuild.TES) {
                    buildType = `.${bus.config.build?.timestamp}beta`
                }
                const localVersion = bus.config.version + buildType
                const release = await latestRelease(localVersion, 'check')
                const cmp = version_compare(localVersion, release.version)
                console.log(localVersion, release.version, cmp)
                if (cmp < 0) {
                    this.newVersion = release
                    this.showUpgrade = true
                    this.versionHTML = xss(marked(release.content))
                } else {
                    ElNotification({
                        type: 'success',
                        title: this.__('已经是最新版本'),
                    })
                }
            } catch (e) {}
            this.upgradeButtonLoading = false
        },
        async doUpgrade() {
            if (bus.config.build.type === 'DEV') {
                ElNotification({
                    type: 'info',
                    title: this.__('开发模式无法自动更新'),
                })
                return
            }
            try {
                const virtualPath = 'C:\\cocogoat'
                await fsex.access(virtualPath)
            } catch (e) {
                /* 虚拟路径不存在，即当前为非单文件运行，此时不支持自动更新 */
                ElNotification({
                    type: 'info',
                    title: this.__('该版本暂不支持自动更新'),
                })
                return
            }
            this.showUpgrade = false
            ElLoading.service({ fullscreen: true, text: this.__('趴在草地上，能听见大地的心跳...') })
            const hash = await getApphash()
            console.log('appHash=', hash)
            let hasPatch = false
            let patchUrl = ''
            try {
                patchUrl = await checkPatch(this.newVersion.url, hash)
                hasPatch = true
            } catch (e) {
                console.log(e)
            }
            console.log('hasPatch=', hasPatch, patchUrl)
            upgrade(hasPatch ? patchUrl : this.newVersion.url.fullPackage, hasPatch)
        },
        clickVersion() {
            this.clickTimes++
            if (this.clickTimes >= 5) {
                this.runtimeDebug = true
            }
        },
        ctxVersion() {
            if (this.runtimeDebug) {
                ipcRenderer.send('devtoolsApp')
            }
        },
        doClearWindowStates() {
            bus.config.options.windowStates = {}
            ElNotification({
                type: 'success',
                title: this.__('窗口状态数据已清除'),
            })
        },
        doClearStorage() {
            ipcRenderer.send('clearStorageData', {
                name: 'persist:mihoyoMap',
                options: {
                    origin: 'https://webstatic.mihoyo.com',
                },
            })
            ElNotification({
                type: 'success',
                title: this.__('登录信息已清除'),
            })
        },
        async doSetJoystick(val) {
            if (val) {
                if (await checkViGEmInstalled()) {
                    ipcRenderer.send('joystickInit')
                    this.joystick = true
                } else {
                    await ElMessageBox.confirm(
                        __('请下载并安装ViGEm驱动 (https://vigem.org/) 以使用手柄模拟功能。'),
                        __('提示'),
                        {
                            confirmButtonText: __('前往下载'),
                            cancelButtonText: __('关闭'),
                            type: 'warning',
                        },
                    )
                    openExternal('https://vigem.org/')
                    return
                }
            } else {
                ipcRenderer.send('joystickStop')
                this.joystick = false
            }
        },
    },
}
</script>
<template>
    <teleport to="#app-title">
        <span>{{ __('设置') }}</span>
    </teleport>
    <teleport to="#app-actions">
        <span class="version" @click="clickVersion" @contextmenu="ctxVersion">
            <span class="main"> v{{ bus.config.version }}</span
            ><small>_{{ bus.config.build?.type.toLowerCase() }}{{ buildTime }}</small>
        </span>
        <span class="upgrade-button">
            <el-badge is-dot class="item" :hidden="!bus.hasUpgrade" type="danger">
                <el-button
                    :loading="upgradeButtonLoading"
                    size="mini"
                    plain
                    icon="el-icon-position"
                    @click="checkUpgrade"
                >
                    <span>{{ __('检查更新') }}</span>
                </el-button>
            </el-badge>
        </span>
    </teleport>
    <el-dialog
        v-if="newVersion"
        v-model="showUpgrade"
        custom-class="upgrade-dialog"
        :title="`${__('新版本:')} v${newVersion.version}`"
        width="400px"
    >
        <section class="version-details">
            <h4>{{ newVersion.name }}</h4>
            <article class="md-render" v-html="versionHTML"></article>
        </section>
        <template #footer>
            <span class="dialog-footer" @click="doUpgrade">
                <el-button size="small" style="width: 100%" type="primary">{{ __('更新') }}</el-button>
            </span>
        </template>
    </el-dialog>
    <div class="page-main">
        <article>
            <el-form label-position="right" label-width="auto" size="small">
                <el-form-item :label="__(`语言(Language)`)">
                    <el-select v-model="$lang.lang">
                        <el-option value="zh" label="简体中文"> 简体中文 </el-option>
                        <el-option v-for="(i, a) in $availableLocales" :key="a" :value="a" :label="i.__name">
                            {{ i.__name }}
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </article>
        <article>
            <h3>{{ __('基础') }}</h3>
            <div class="content-desc">{{ __('这些选项将在程序重启后生效。') }}</div>
            <div class="content">
                <div class="opt">
                    <el-switch
                        :active-text="__('发送错误日志，协助我们改进程序')"
                        :model-value="options.sendErrorReports"
                        @update:model-value="opt('sendErrorReports', $event)"
                    >
                    </el-switch>
                </div>
                <div class="opt">
                    <el-switch
                        :active-text="__('启用OCR识别错误反馈功能')"
                        :model-value="options.sendWrongOCRReports"
                        @update:model-value="opt('sendWrongOCRReports', $event)"
                    >
                    </el-switch>
                </div>
                <br />
                <el-form label-position="right" label-width="auto" size="small">
                    <el-form-item :label="__('窗口状态数据')">
                        <el-button @click="doClearWindowStates">
                            {{ __('清除保存的窗口数据') }}
                        </el-button>
                        <div class="form-desc">{{ __('这在你找不到悬浮窗时或许有用。') }}</div>
                    </el-form-item>
                    <el-form-item :label="__('登录信息数据')">
                        <el-button @click="doClearStorage">
                            {{ __('清除保存的登录信息') }}
                        </el-button>
                        <div class="form-desc">{{ __('这将清除大地图的登录信息和本地标点等') }}</div>
                    </el-form-item>
                </el-form>
            </div>
        </article>
        <article>
            <h3>{{ __('圣遗物') }}</h3>
            <div class="content-desc">{{ __('这些选项将在下次打开识别器或切换器时生效。') }}</div>
            <div class="content">
                <el-form label-position="right" label-width="auto" size="small">
                    <el-form-item :label="__('保留重复识别')">
                        <el-switch
                            :model-value="options.artifacts.keepSameArtifacts"
                            @update:model-value="opt('artifacts.keepSameArtifacts', $event)"
                        ></el-switch>
                        <div class="form-desc">{{ __('得到两个完全一致的圣遗物的概率是多少呢？') }}</div>
                    </el-form-item>
                    <el-form-item :label="__('加速滚动')">
                        <el-switch
                            :model-value="options.artifacts.fastScroll"
                            @update:model-value="opt('artifacts.fastScroll', $event)"
                        ></el-switch>
                        <div class="form-desc">
                            {{ __('如果出现翻页时滚动过快跳过行的情况，或您正在高延迟环境下使用云游戏，请关闭此项。') }}
                        </div>
                    </el-form-item>
                    <el-form-item :label="__('升级智能判断')">
                        <el-switch
                            :model-value="options.artifacts.upgradeArtifacts"
                            @update:model-value="opt('artifacts.upgradeArtifacts', $event)"
                        ></el-switch>
                        <div class="form-desc">{{ __('自动判断圣遗物升级(Beta)，但为什么总是女仆狂喜呢？') }}</div>
                        <div class="form-desc">{{ __('（可能导致极少量圣遗物不入库）') }}</div>
                    </el-form-item>
                    <el-form-item :label="__('独立切换模式')">
                        <el-switch
                            :model-value="options.artifacts.preserveSwitcher"
                            @update:model-value="opt('artifacts.preserveSwitcher', $event)"
                        ></el-switch>
                        <div class="form-desc">{{ __('允许在关闭识别器时，保留切换器窗口以配合其他工具使用。') }}</div>
                    </el-form-item>
                    <el-form-item :label="__('自动切换延迟')">
                        <el-input-number
                            :modelValue="options.artifacts.autoSwitchDelay"
                            :min="0"
                            :precision="1"
                            :step="0.1"
                            :max="30"
                            @update:model-value="opt('artifacts.autoSwitchDelay', $event)"
                        ></el-input-number>
                        {{ __('秒') }}
                        <div class="form-desc">
                            {{ __('圣遗物切换器每次点击（并识别完成）后切换到下一个的间隔。') }}
                            <br />
                            {{ __('可用于人工检查识别准确性，或关闭识别器窗口并配合其他工具使用。') }}
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </article>
        <article>
            <h3>
                {{ __('手柄模拟') }}
            </h3>
            <div class="content">
                <el-form label-position="right" label-width="auto" size="small">
                    <el-form-item :label="__('启用手柄模拟')">
                        <el-switch :model-value="joystick" @update:model-value="doSetJoystick"></el-switch>
                        <div class="form-desc">
                            {{ __('启用后，程序将模拟一个Xbox手柄。圣遗物切换器将使用模拟的手柄进行切换。') }}
                        </div>
                        <div class="form-desc">
                            {{ __('您需要先启用此功能再启动游戏，而后在游戏内设置控制模式为手柄。') }}
                        </div>
                        <div class="form-desc">
                            {{
                                __(
                                    '为提供简单操作的能力，以下按键映射将被启用：ABXY为键盘的对应按键，左右肩键为PageUP与PageDown，Esc可打开派蒙菜单，摇杆由键盘方向键控制。',
                                )
                            }}
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </article>
        <article>
            <h3>
                {{ __('关于') }}
            </h3>
            <div class="content">
                <div class="opt title">{{ __('椰羊cocogoat') }}</div>
                <div class="opt">{{ __('一个简单的原神工具箱，保证每一行代码都是加班打造。是半仙之兽。') }}</div>
                <div class="opt">&copy; 2021 月海亭 YuehaiTeam</div>
            </div>
        </article>
    </div>
</template>

<style lang="scss" scoped>
h3 {
    font-weight: normal;
    padding-left: 5px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
}
.content {
    padding: 5px;
    font-size: 13px;
    .opt {
        margin-bottom: 7px;
    }
    .title {
        font-size: 17px;
    }
    &::v-deep(.el-form-item__label) {
        color: #333;
    }
    &::v-deep(.el-form-item) {
        margin-bottom: 8px;
    }
}
.form-desc {
    margin-top: 6px;
    line-height: 17px;
    font-size: 13px;
}
.content-desc {
    padding-left: 5px;
    margin-top: -6px;
    margin-bottom: 6px;
    line-height: 17px;
    font-size: 13px;
}
.version {
    display: inline-block;
    margin-right: 23px;
    font-size: 13px;
}
.version-details {
    h4 {
        margin-bottom: 5px;
    }
}
.upgrade-button {
    display: inline-block;
    line-height: normal;
}
</style>
<style lang="scss">
.upgrade-dialog {
    .el-dialog__body {
        padding: 5px 20px;
        margin-top: -20px;
    }
}
</style>
