import path from 'path'
import { config } from './index'
import promisify from '@/plugins/opencv4nodejs/promisify'
import { parentPort } from 'worker_threads'

let cv: any
let surf: any
let fullMapMat: any
let fkeyPoints: any
let fullmapDet: any

export function mapcvWorkerInit() {
    if (!parentPort) return
    const ppocrObjPath = path.join(config.dataDir, 'opencv', 'opencv4nodejs452.node')
    cv = promisify(__non_webpack_require__(ppocrObjPath))

    parentPort.postMessage({
        event: 'ready',
    })
    parentPort.on('message', async (event) => {
        if (!parentPort) return
        if (!cv) return
        if (event.event === 'exit') {
            cv = null
            console.log('Worker exit')
            process.exit()
        }
        if (event.event === 'mapcvInit') {
            // initialize full map
            const { width, height, data } = event.message.image
            fullMapMat = new cv.Mat(data, height, width, cv.CV_8UC4)
            fullMapMat = await fullMapMat.cvtColor(cv.COLOR_RGBA2RGB)
            surf = new cv.SURFDetector(400)
            surf.upright = true
            fkeyPoints = await surf.detectAsync(fullMapMat)
            fullmapDet = await surf.computeAsync(fullMapMat, fkeyPoints)
            console.log('mapcv fullmap ready')
            reply(event, true)
        }
        if (event.event === 'mapcv') {
            if (!fullmapDet) {
                reply(event, false)
            }
            // detect & compute small map
            const { width, height, data } = event.message.image
            const rawSmallMapMat = new cv.Mat(data, height, width, cv.CV_8UC4)
            const smallMapMat = await rawSmallMapMat.cvtColor(cv.COLOR_RGBA2RGB)
            rawSmallMapMat.release()
            const skeyPoints = await surf.detectAsync(smallMapMat)
            const smallmapDet = await surf.computeAsync(smallMapMat, skeyPoints)
            if (smallmapDet.empty) {
                smallMapMat.release()
                smallmapDet.release()
                return reply(event, false)
            }
            const matches = await cv.matchKnnFlannBasedAsync(fullmapDet, smallmapDet, 2)

            const ratio_thresh = 0.7
            let bestMatches = []
            for (const i of matches) {
                if (i[0].distance < ratio_thresh * i[1].distance) {
                    bestMatches.push(i[0])
                }
            }

            // only keep good matches
            const bestN = 40
            bestMatches = bestMatches
                .sort((match1: any, match2: any) => match1.distance - match2.distance)
                .slice(0, bestN)

            const fullmapPoints = []
            const smallmapPoints = []
            for (const i of bestMatches) {
                fullmapPoints.push(fkeyPoints[i.queryIdx].pt)
                smallmapPoints.push(skeyPoints[i.trainIdx].pt)
            }
            const H = cv.findHomography(smallmapPoints, fullmapPoints, cv.RANSAC)
            const matData = [
                [[0, 0]],
                [[smallMapMat.cols, 0]],
                [[smallMapMat.cols, smallMapMat.rows]],
                [[0, smallMapMat.rows]],
            ]
            const srcCorners = new cv.Mat(matData, cv.CV_32FC2)
            let dstMap
            try {
                dstMap = srcCorners.perspectiveTransform(H.homography)
            } catch (e) {
                smallMapMat.release()
                smallmapDet.release()
                srcCorners.release()
                return reply(event, false)
            }
            const dstArray = dstMap.getDataAsArray()

            const dstCorners = []
            for (let i = 0; i < dstArray.length; i++) {
                dstCorners.push({ x: dstArray[i][0][0], y: dstArray[i][0][1] })
            }
            const llr = Math.sqrt(
                Math.pow(dstCorners[2].y - dstCorners[0].y, 2) + Math.pow(dstCorners[2].x - dstCorners[0].x, 2),
            )
            const lrl = Math.sqrt(
                Math.pow(dstCorners[3].y - dstCorners[1].y, 2) + Math.pow(dstCorners[3].x - dstCorners[1].x, 2),
            )
            if (llr / lrl > 3 || lrl / llr > 3) {
                // 对角线长度差超过3，大概率是没找到点，直接静止不动
                smallMapMat.release()
                smallmapDet.release()
                srcCorners.release()
                return reply(event, false)
            }
            const klr = (dstCorners[2].y - dstCorners[0].y) / (dstCorners[2].x - dstCorners[0].x)
            const krl = (dstCorners[3].y - dstCorners[1].y) / (dstCorners[3].x - dstCorners[1].x)
            const cross = new cv.Point2(
                (klr * dstCorners[0].x - dstCorners[0].y - krl * dstCorners[1].x + dstCorners[1].y) / (klr - krl),
                (klr * krl * (dstCorners[0].x - dstCorners[1].x) + klr * dstCorners[1].y - krl * dstCorners[0].y) /
                    (klr - krl),
            )
            smallMapMat.release()
            smallmapDet.release()
            srcCorners.release()
            dstMap.release()

            reply(event, {
                center: {
                    x: cross.x,
                    y: cross.y,
                },
                corners: dstCorners,
                total: {
                    w: fullMapMat.cols,
                    h: fullMapMat.rows,
                },
            })
        }
    })
}
function reply(event: any, message: any) {
    if (!parentPort) return
    parentPort.postMessage({
        event: 'reply',
        message,
        reply: event.reply,
        id: event.id,
    } as { event: string; message: any; reply?: any; id?: string })
}
