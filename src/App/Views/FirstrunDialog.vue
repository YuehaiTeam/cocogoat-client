<script lang="ts">
import { bus } from '@/App/bus'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        show: {
            type: Boolean as PropType<boolean>,
            default: false,
        },
    },
    data() {
        return {
            sendErrorReports: true,
            sendWrongOCRReports: false,
        }
    },
    methods: {
        doSave() {
            bus.config.options.sendErrorReports = this.sendErrorReports
            bus.config.options.sendWrongOCRReports = this.sendWrongOCRReports
            bus.config.options.firstRun = false
        },
    },
})
</script>
<template>
    <el-dialog
        custom-class="fullscreen-dialog firstrun-dialog"
        title="欢迎使用椰羊cocogoat"
        width="440px"
        :model-value="show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        destroy-on-close
    >
        <div class="firstrun-box">
            <h4>
                这是一个简单的原神工具箱，提供圣遗物识别等便利功能。
                <br />
                在开始之前，有一些事项需要征求您的同意...
            </h4>

            <div class="opt">
                <el-switch v-model="sendErrorReports" active-text="发送错误日志协助我们改进程序"> </el-switch>
            </div>
            <div class="opt">
                <el-switch v-model="sendWrongOCRReports" active-text="发送圣遗物识别错误与修改日志帮助我们提高识别率">
                </el-switch>
            </div>
            <div class="opt small-txt">
                保存后，您可以随时在设置页面更改这些选项，但需要重启程序生效。除此之外，本程序会在每次启动时自动检查新版本，但需要您手动确认才会进行更新。点击开始使用按钮，代表您同意以上内容。
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button style="width: 100%" size="small" type="primary" @click="doSave">保存并开始使用</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.firstrun-box {
    h4 {
        margin-top: -25px;
        font-weight: normal;
        margin-bottom: 20px;
    }
    .opt {
        margin-bottom: 10px;
    }
    .small-txt {
        font-size: 13px;
        padding: 10px 0;
        padding-top: 15px;
    }
}
</style>
<style lang="scss">
.firstrun-dialog .el-dialog__body {
    padding-bottom: 0;
}
</style>
