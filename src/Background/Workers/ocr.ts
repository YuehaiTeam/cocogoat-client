import path from 'path'
import { config } from './index'
import { parentPort } from 'worker_threads'
let ppocr: any

export function ocrWorkerInit(data: { rec: string; det: string; dic: string }) {
    if (!parentPort) return
    const { rec, det, dic } = data
    const ppocrObjPath = path.join(config.dataDir, 'paddleocr', 'ppocr.node')
    ppocr = __non_webpack_require__(ppocrObjPath)
    ppocr.load(det, rec, dic, false)
    parentPort.postMessage({
        event: 'ready',
    })
    parentPort.on('message', (event) => {
        if (!parentPort) return
        if (event.event === 'exit') {
            ppocr.unload()
            console.log('Worker exit')
            process.exit()
        }
        if (event.event === 'ocr') {
            const { width, height, data } = event.message.image
            const rawResult: string[] = ppocr.ocr(width, height, data)
            const response = {
                ppocr: true,
                words: [] as any[],
                text: '',
            }
            for (let i = 0; i < rawResult.length; i += 2) {
                response.text += rawResult[i]
                response.text += '\n'
                response.words.push({
                    confidence: parseFloat(rawResult[i + 1]) * 100,
                    text: rawResult[i],
                })
            }
            parentPort.postMessage({
                event: 'reply',
                message: response,
                reply: event.reply,
                id: event.id,
            } as { event: string; message: any; reply?: any; id?: string })
        }
    })
}
