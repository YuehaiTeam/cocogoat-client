<script>
import { bus } from './bus'
import { getCV } from '@/plugins/opencv'
import { ipcRenderer } from 'electron'
import AppHeader from './Components/AppHeader'
import { getposition, capture, mapcv, mapcvInit, sendToMapWindow } from './ipc'
import map3k from '@/assets/map/map2107-4.jpg'
import { sleep } from '@/ArtifactView/utils'
let cv
export default {
    components: {
        AppHeader,
    },
    computed: {},
    async mounted() {
        ipcRenderer.send('ready')
        const cv2 = getCV()
        const map = this.loadImage(map3k)
        cv = await cv2
        bus.ready = await mapcvInit(await map)
        window.$vm = this
        window.cv = cv
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
            const mcvres = mapcv(mapImage)
            let mcvang = await this.getAngle(canvas)
            const rawCV = await mcvres
            return rawCV ? { ...rawCV, angle: mcvang } : false
        },
        async getAngle(canvasr) {
            const canvas = document.createElement('canvas')
            canvas.width = canvasr.width * (400 / canvasr.height)
            canvas.height = 400
            const ctx = canvas.getContext('2d')
            ctx.drawImage(canvasr, 0, 0, canvas.width, canvas.height)

            const src = cv.imread(canvas)
            let dst2 = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3)
            const contours = new cv.MatVector()
            const hierarchy = new cv.Mat()
            let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 210, 210, 0])
            let high = new cv.Mat(src.rows, src.cols, src.type(), [5, 255, 255, 255])
            cv.inRange(src, low, high, src)
            cv.bitwise_not(src, src)
            const M3 = cv.Mat.ones(3, 3, cv.CV_8U)
            cv.erode(src, src, M3)
            cv.findContours(src, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
            const points = []
            const poly = new cv.MatVector()
            for (let i = 0; i < contours.size(); i++) {
                const c = contours.get(i)
                const h = cv.boundingRect(c).height
                if (h > canvas.width / 2 || h < canvas.width / 10) continue
                const epsilon = 0.04 * cv.arcLength(c, true)
                const approx = new cv.Mat()
                cv.approxPolyDP(c, approx, epsilon, true)
                for (let j = 0; j < approx.data32S.length; j += 2) {
                    let p = {}
                    p.x = approx.data32S[j]
                    p.y = approx.data32S[j + 1]
                    points.push(p)
                    poly.push_back(approx)
                    let color = new cv.Scalar(
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255),
                    )
                    cv.drawContours(dst2, poly, 0, color, 1, 8, hierarchy, 0)
                }
                approx.delete()
            }
            M3.delete()
            src.delete()
            contours.delete()
            hierarchy.delete()
            low.delete()
            high.delete()
            if (points.length !== 3) return false
            const a = [distance(points[0], points[1]), distance(points[1], points[2]), distance(points[2], points[0])]
            const sa = [Math.abs(a[0] - a[1]), Math.abs(a[1] - a[2]), Math.abs(a[2] - a[0])]
            const smin = sa.indexOf(Math.min(...sa))
            let lp
            let rp
            let hp
            switch (smin) {
                case 0:
                    lp = 2
                    rp = 0
                    hp = 1
                    break
                case 1:
                    lp = 0
                    rp = 1
                    hp = 2
                    break
                case 2:
                    lp = 1
                    rp = 2
                    hp = 0
                    break
            }
            const mpp = {
                x: (points[lp].x + points[rp].x) / 2,
                y: (points[lp].y + points[rp].y) / 2,
            }
            const hpp = points[hp]
            function distance(p1, p2) {
                return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
            }
            function calcAngle(start, end) {
                const diff_x = end.x - start.x
                const diff_y = end.y - start.y
                const radian = Math.atan(diff_y / diff_x) // 弧度
                let angle = Math.floor(180 / (Math.PI / radian)) // 弧度转角度
                if (diff_x < 0) {
                    // x小于0的时候加上180°，即实际角度
                    angle = angle + 180
                }
                return angle + 90
            }
            return calcAngle(mpp, hpp)
        },
        async ensurePosition(data) {
            /*
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
            } */
            return data.center
        },
        async convertAxis(x, y, ratio, tX, tY) {
            let pX = x / ratio
            let pY = y / ratio
            return {
                x: tX + pX,
                y: tY + pY,
            }
        },
        async loadImage(s) {
            const imgEl = new Image()
            imgEl.src = s
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
