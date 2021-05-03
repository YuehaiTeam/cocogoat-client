<script>
import { bus } from './bus'
import { ipcRenderer } from 'electron'
import AppHeader from './Components/AppHeader'
import { getposition, capture, mapcv, mapcvInit, sendToMapWindow } from './ipc'
import map3k from '@/assets/map/genshin_map_w3000.jpg'
import { sleep } from '@/ArtifactView/utils'
export default {
    components: {
        AppHeader,
    },
    computed: {},
    async mounted() {
        ipcRenderer.send('ready')
        bus.ready = await mapcvInit(await this.loadMap())
        window.$vm = this
    },
    methods: {
        checkAuto() {
            if (!bus.auto) {
                this.auto()
                return
            }
            bus.auto = false
        },
        async auto() {
            bus.auto = true
            while (bus.auto) {
                await Promise.all([sleep(500, this.processOnce())])
            }
        },
        async processOnce() {
            const res = await this.captureAndCompute()
            if (res) {
                sendToMapWindow('position', res)
            }
        },
        async captureAndCompute() {
            const canvas = await this.getCanvas()
            if (!bus.auto) {
                new Image().src = canvas.toDataURL()
            }
            const ctx = canvas.getContext('2d')
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const mapImage = {
                width: canvas.width,
                height: canvas.height,
                data: Buffer.from(imageData.data.buffer),
            }
            const rawCV = await mapcv(mapImage)
            return rawCV ? this.ensurePosition(rawCV) : false
        },
        async ensurePosition(data) {
            const ratio = 5450 / 3000 // 地图缩放比
            let { x, y } = data.center
            let r
            if (x <= 458 && y <= 330) {
                // 蒙德城
                r = this.convertAxis(x, y, ratio, 1599, 515)
            } else if (x <= 497 && y <= 680) {
                // 璃月港
                r = this.convertAxis(x, y - 330, ratio, 1015, 2074)
            }
            if (r) {
                return r
            }
            return {
                x,
                y,
            }
        },
        async convertAxis(x, y, ratio, tX, tY) {
            let pX = x / ratio
            let pY = y / ratio
            return {
                x: tX + pX,
                y: tY + pY,
            }
        },
        async loadMap() {
            const imgEl = new Image()
            imgEl.src = map3k
            await new Promise((resolve) => {
                imgEl.onload = resolve
            })
            const canvas = document.createElement('canvas')
            canvas.width = imgEl.width
            canvas.height = imgEl.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height)
            const imageData = ctx.getImageData(0, 0, imgEl.width, imgEl.height)
            return {
                width: imgEl.width,
                height: imgEl.height,
                data: Buffer.from(imageData.data.buffer),
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
                canvas.height = h - 2 - 30
                const ctx = canvas.getContext('2d')
                ctx.imageSmoothingEnabled = true
                ctx.drawImage(srcCanvas, 2, 30, w, h, 0, 0, w, h)
            }
            if (bus.runtimeDebug) {
                new Image().src = canvas.toDataURL()
            }
            return canvas
        },
    },
}
</script>
<template>
    <app-header @auto="checkAuto" />
</template>
<style lang="scss">
@import '~@/styles/fonts.scss';
* {
    font-family: GenshinImpact;
}
</style>
<style lang="scss" scoped></style>
