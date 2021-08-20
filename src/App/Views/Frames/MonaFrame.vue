<script lang="ts">
import { bus } from '@/App/bus'
import { defineComponent } from 'vue'
import { convertAsMona } from '@/App/export/Mona'
export default defineComponent({
    components: {},
    data() {
        return {
            loading: true,
        }
    },
    mounted() {
        const convertedJson = JSON.stringify(convertAsMona(JSON.parse(JSON.stringify(bus.artifacts))))
        const frame: any = this.$refs.monaFrame
        // @ts-ignore
        window.monaFrame = frame
        frame.addEventListener(
            'dom-ready',
            () => {
                frame.insertCSS(`
                aside.el-aside {
                    width: 220px !important;
                }
                .title.past {
                    margin: 0 !important;
                }
                .character-panel {
                    flex-wrap: wrap !important;
                }
                @media only screen and (min-width: 900px){
                    html body .hidden-sm-and-down {
                        display: block!important;
                    }
                    html body .hidden-md-and-up{
                        display:none !important;
                    }
                }`)
                frame.executeJavaScript(`monaAPI.updateAllArtifacts(${convertedJson})`)
                this.loading = false
            },
            { once: true },
        )
    },
})
</script>
<template>
    <teleport to="#app-title">
        <span>{{ __('莫娜占卜铺') }}</span>
        <span class="title-desc">{{ __('(由 @wormtql 开发，已授权)') }}</span>
    </teleport>
    <div class="page-main">
        <div
            v-loading="loading"
            element-loading-text="__('正在敲开伟大占星术士的家门...')"
            element-loading-background="#fff"
            class="loading-area"
        ></div>
        <webview
            id="mona-frame"
            ref="monaFrame"
            src="https://mona-uranai.com/"
            style="width: 100%; height: 100%; margin: 0"
        ></webview>
    </div>
</template>

<style lang="scss" scoped>
.page-main {
    width: calc(100% + 40px);
    height: calc(100% + 40px);
    margin: -20px;
    background: #fff;
}
.loading-area {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
    pointer-events: none;
}
.title-desc {
    font-size: 13px;
}
</style>
