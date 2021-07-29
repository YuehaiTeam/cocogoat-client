<script>
import path from 'path'
import fsex from 'fs-extra'
import { watch } from 'vue'
import { bus } from './bus'
import { ipcRenderer } from 'electron'
import AppHeader from './Components/AppHeader'
import RoutePlayer from './Components/RoutePlayer'
let seeliePlugin = ''
export default {
    components: {
        AppHeader,
        RoutePlayer,
    },
    data() {
        return {
            ready: false,
            showRoute: false,
            mapUrl: `https://webstatic.mihoyo.com/app/ys-map-cn/index.html#/map/2?center=${bus.y},${bus.x}&zoom=${bus.zoom}`,
        }
    },
    computed: {
        hash() {
            return `#/map/2?center=${bus.y},${bus.x}&zoom=${bus.zoom}`
        },
    },
    async mounted() {
        ipcRenderer.send('ready')
        this._updatePosition = this.updatePosition.bind(this)
        ipcRenderer.on('position', this._updatePosition)
        this.unwatch = watch([() => bus.x, () => bus.y, () => bus.zoom], () => {
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
        drawPath(dataArr) {
            const frame = this.$refs.mapFrame
            frame?.executeJavaScript(`_cocogoat_draw_path(${JSON.stringify(dataArr)})`)
        },
        async updatePosition(event, data) {
            // 米游社大地图与内置地图坐标转换
            bus.x = data.center.x * 2 - 3212
            bus.y = data.center.y * 2 - 1164
            const frame = this.$refs.mapFrame
            if (data.angle) {
                frame?.executeJavaScript(`try{COCOGOAT_USER_MARKER.setRotationAngle(${data.angle / 2})}catch(e){}`)
            }
            frame?.executeJavaScript(`try{COCOGOAT_USER_MARKER.setLatLng({lat:${bus.y},lng:${bus.x}})}catch(e){}`)
        },
        onHashChange(event) {
            bus.zoom = event.url.split('zoom=')[1].split('&')[0]
            const center = event.url.split('center=')[1].split('&')[0].split(',')
            bus.x = center[1]
            bus.y = center[0]
        },
        async onDomReady() {
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

            @media only screen and (max-width: 900px) {
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
                    left: auto !important;
                    bottom: auto !important;
                    position: fixed !important;
                    top: 0.08rem;
                    right: 0.55rem !important;
                    background-position: 0.02rem;
                }
            }`)
            seeliePlugin =
                seeliePlugin || (await fsex.readFile(path.join(bus.dataDir, 'seelie', 'seelie-map.js'))).toString()
            frame.executeJavaScript(seeliePlugin)
            // @ts-ignore
            window.frame = frame
        },
    },
}
</script>
<template>
    <app-header @toggleRoute="showRoute = !showRoute" />
    <route-player v-if="showRoute" />
    <webview
        ref="mapFrame"
        class="mapFrame"
        partition="persist:mihoyoMap"
        :src="mapUrl"
        @dom-ready="onDomReady"
        @did-navigate-in-page="onHashChange"
    />
</template>
<style lang="scss">
@import '~@/styles/fonts.scss';
* {
    font-family: GenshinImpact;
}
.el-message-box {
    max-width: 90%;
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
