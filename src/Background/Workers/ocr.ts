import path from 'path'
import { config } from './index'
import { parentPort } from 'worker_threads'
import { IocrResult } from '@/typings/ocr'
let ppocr: any
export async function ocrWorkerInit(data: { rec: string; det: string; dic: string }) {
    if (!parentPort) return
    const { rec, det, dic } = data

    const ppocrObjPath = path.join(config.dataDir, 'paddleocr', 'ppocr.node')
    try {
        ppocr = __non_webpack_require__(ppocrObjPath)
    } catch (e) {
        console.error(e)
        parentPort.postMessage({
            event: 'error',
            message: e.messgae,
        })
        process.exit()
    }
    ppocr.load(det, rec, dic, {
        use_gpu: false,
        gpu_id: 0,
        use_mkldnn: false,
        use_tensorrt: false,
        use_fp16: false,
        gpu_mem: 4000,
        cpu_math_library_num_threads: 16,
        max_side_len: 1920,
        det_db_unclip_ratio: 2.0,
        det_db_box_thresh: 0.5,
        det_db_thresh: 0.3,
    })
    parentPort.postMessage({
        event: 'ready',
    })
    parentPort.on('message', (event) => {
        if (!parentPort) return
        if (event.event === 'exit') {
            console.log('Worker exit')
            process.exit()
        }
        if (event.event === 'ocr') {
            const { width, height, data } = event.message.image
            let result: IocrResult[]
            if (event.message.image.det) {
                result = ppocr.ocr(width, height, data)
            } else {
                const ret = ppocr.recognize(width, height, data)
                result = [
                    {
                        text: ret[0],
                        confidence: ret[1],
                        box: [],
                    },
                ]
            }
            result.reverse()
            parentPort.postMessage({
                event: 'reply',
                message: result,
                reply: event.reply,
                id: event.id,
            } as { event: string; message: any; reply?: any; id?: string })
        }
    })
}
