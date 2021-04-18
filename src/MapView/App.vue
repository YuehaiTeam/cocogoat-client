<script>
import { bus } from './bus'
import { ipcRenderer } from 'electron'
import AppHeader from './Components/AppHeader'
import { watch } from 'vue'
export default {
    components: {
        AppHeader,
    },
    data() {
        return {
            ready: false,
            mapUrl: `https://webstatic.mihoyo.com/app/ys-map-cn/index.html#/map/2?center=${bus.y},${bus.x}&zoom=${bus.zoom}`,
        }
    },
    computed: {
        hash() {
            return `#/map/2?center=${bus.y},${bus.x}&zoom=${bus.zoom}`
        },
    },
    mounted() {
        ipcRenderer.send('ready')
        this._updatePosition = this.updatePosition.bind(this)
        ipcRenderer.on('position', this._updatePosition)
        this.unwatch = watch([() => bus.x, () => bus.y, () => bus.zoom], (x, y, zoom) => {
            const frame = this.$refs.mapFrame
            frame.executeJavaScript(`location.hash='${this.hash}'`)
        })
        window.$vm = this
    },
    beforeUnmount() {
        this.unwatch()
        ipcRenderer.off('position', this._updatePosition)
    },
    methods: {
        async updatePosition(event, data) {
            // 米游社大地图与内置地图坐标转换
            bus.x = (data.center.x * 5450) / 3000 + 1742 - 4845
            bus.y = (data.center.y * 4850) / 2669 + 1742 - 2795
        },
        onDomReady() {
            if (this.ready) return
            this.ready = true
            const frame = this.$refs.mapFrame

            frame.insertCSS(`body .announcement {
                display: none !important;
            }
            body .header {
                display: none !important;
            }

            body .mhy-bbs-app-header {
                display: none;
            }

            body .mhy-map__wiki-link {
                display: none;
            }

            body .mhy-map__mobile-announcement {
                display: none;
            }

            body .mhy-user {
                right: .09rem !important;
                left: auto !important;
                top: .08rem !important;
            }

            body .mhy-map__add-custom {
                width: .38rem;
                height: .38rem !important;
                padding: 0 !important;
                box-sizing: border-box;
                text-indent: -9999px;
                right: .07rem !important;
                left: auto !important;
                bottom: auto !important;
                top: 1.6rem;
                position: fixed !important;
            }`)
            // @ts-ignore
            window.frame = frame
        },
    },
}
</script>
<template>
    <app-header />
    <webview ref="mapFrame" class="mapFrame" :src="mapUrl" @dom-ready="onDomReady" />
</template>
<style lang="scss">
@import '~@/styles/fonts.scss';
* {
    font-family: GenshinImpact;
}
</style>
<style lang="scss" scoped>
.mapFrame {
    position: absolute;
    top: 30px;
    left: 2px;
    right: 2px;
    bottom: 0;
}
</style>
