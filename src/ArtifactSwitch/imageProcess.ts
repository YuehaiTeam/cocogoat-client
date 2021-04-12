import { getposition } from './ipc'
import { getCV } from '@/plugins/opencv'
export async function getBlocks(canvas: HTMLCanvasElement) {
    const cv = await getCV()
    const src = cv.imread(canvas)
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    // 二值化
    cv.medianBlur(src, src, 1)
    cv.threshold(src, src, 200, 255, cv.THRESH_BINARY)
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0)
    cv.bitwise_not(src, src)
    cv.threshold(src, src, 80, 255, cv.THRESH_BINARY)
    // 加强边框
    const M6 = cv.Mat.ones(6, 6, cv.CV_8U)
    const M3 = cv.Mat.ones(3, 3, cv.CV_8U)
    const M4 = cv.Mat.ones(4, 4, cv.CV_8U)
    cv.erode(src, src, M6)
    cv.dilate(src, src, M3)
    cv.dilate(src, src, M4, new cv.Point(-1, -1), 4)
    cv.erode(src, src, M6)
    // 搜索区域
    cv.findContours(src, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
    // 转为可读格式
    const data = []
    for (let i = 0; i < contours.size(); i++) {
        data.push(cv.boundingRect(contours.get(i)))
    }
    const dbgCanvas = document.createElement('canvas')
    dbgCanvas.width = canvas.width
    dbgCanvas.height = canvas.height
    cv.imshow(dbgCanvas, src)
    new Image().src = dbgCanvas.toDataURL()
    src.delete()
    contours.delete()
    hierarchy.delete()
    M3.delete()
    M4.delete()
    M6.delete()
    return data
}
export async function imageDump(canvas: HTMLCanvasElement) {
    /* dynamic require node modules */
    const path = require('path')
    const fsex = require('fs-extra')
    const exportPath = path.join(require('os').tmpdir(), 'cocogoat', 'artifacts')
    await fsex.ensureDir(exportPath)
    const filename = path.join(exportPath, `list.png`)
    console.log(filename)
    const b64img = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '')
    await fsex.writeFile(filename, Buffer.from(b64img, 'base64'))
}
export async function toWindowPos(dx: number, dy: number) {
    const offsetY = 80
    const offsetX = 2
    const [winx, winy] = await getposition()
    const x = winx + dx + offsetX
    const y = winy + dy + offsetY
    return { x, y }
}
