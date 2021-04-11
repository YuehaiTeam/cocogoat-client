<script>
import dayjs from 'dayjs'
import { ipcRenderer } from 'electron'
import { bus } from '@/App/bus'
import $set from 'lodash/set'
export default {
    data() {
        return {
            clickTimes: 0,
            runtimeDebug: false,
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
        checkUpdate() {
            this.$alert('请自行前往 https://github.com/YuehaiTeam/cocogoat 查看新版本', '暂未开放', {
                confirmButtonText: '知道了',
            })
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
    },
}
</script>
<template>
    <teleport to="#app-title"> 设置 </teleport>
    <teleport to="#app-actions">
        <span class="version" @click="clickVersion" @contextmenu="ctxVersion">
            <span class="main"> v{{ bus.config.version }}</span
            ><small>_{{ bus.config.build?.type.toLowerCase() }}{{ buildTime }}</small>
        </span>
        <el-button size="mini" plain icon="el-icon-position" @click="checkUpdate">检查更新</el-button>
    </teleport>
    <div class="page-main">
        <article>
            <h3>基础</h3>
            <div class="content">
                <div class="opt">
                    <el-switch
                        :model-value="options.sendErrorReports"
                        active-text="发送错误日志，协助我们改进程序"
                        @update:model-value="opt('sendErrorReports', $event)"
                    >
                    </el-switch>
                </div>
                <!--div class="opt">
                    <el-switch active-text="上传圣遗物识别错误与修改日志，帮助我们提高识别率"> </el-switch>
                </div-->
            </div>
        </article>
        <article>
            <h3>圣遗物</h3>
            <div class="content-desc">这些选项将在下次打开识别器或切换器时生效。</div>
            <div class="content">
                <el-form label-position="right" label-width="auto" size="small">
                    <el-form-item label="保留重复识别">
                        <el-switch disabled :model-value="options.artifacts.keepSameArtifacts"></el-switch>
                        <div class="form-desc">得到两个完全一致的圣遗物的概率是多少呢？</div>
                    </el-form-item>
                    <el-form-item label="独立切换模式">
                        <el-switch
                            :model-value="options.artifacts.preserveSwitcher"
                            @update:model-value="opt('artifacts.preserveSwitcher', $event)"
                        ></el-switch>
                        <div class="form-desc">允许在关闭识别器时，保留切换器窗口以配合其他工具使用。</div>
                    </el-form-item>
                    <el-form-item label="自动切换延迟">
                        <el-input-number
                            :modelValue="options.artifacts.autoSwitchDelay"
                            :min="0.5"
                            :precision="1"
                            :step="0.1"
                            :max="30"
                            @update:model-value="opt('artifacts.autoSwitchDelay', $event)"
                        ></el-input-number>
                        秒
                        <div class="form-desc">
                            圣遗物切换器每次点击（并识别完成）后切换到下一个的间隔。<br />可用于人工检查识别准确性，或关闭识别器窗口并配合其他工具使用。
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </article>
        <article>
            <h3>关于</h3>
            <div class="content">
                <div class="opt title">椰羊cocogoat</div>
                <div class="opt">一个简单的原神工具箱，保证每一行代码都是加班打造。是半仙之兽。</div>
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
</style>
