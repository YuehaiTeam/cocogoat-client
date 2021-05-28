import path from 'path'
import { captureError, config } from './index'
import { parentPort } from 'worker_threads'
import { IocrResult } from '@/typings/ocr'
import { sleep } from '@/ArtifactView/utils'
let ppocr: any
export async function ocrWorkerInit(data: { rec: string; det: string; dic: string; noavx: boolean }) {
    console.log('ocrWorkerInit')
    if (!parentPort) return
    const { rec, det, dic } = data
    let { noavx } = data

    const ppocrObjPath = path.join(config.dataDir, 'paddleocr', 'node-paddleocr.node')
    const ppocrObjPathNoAVX = path.join(config.dataDir, 'paddleocr', 'node-paddleocr.noavx.node')
    console.log('Loading library')
    if (noavx) {
        try {
            ppocr = __non_webpack_require__(ppocrObjPathNoAVX)
            noavx = true
        } catch (e) {
            console.error(e)
            parentPort.postMessage({
                event: 'error',
                message: e.message || e.stack ? e.stack.trim().split('\n')[0] : '未知错误',
            })
            await sleep(100)
            process.exit()
        }
    } else {
        try {
            ppocr = __non_webpack_require__(ppocrObjPath)
        } catch (e) {
            captureError(e)
            console.error(e)
            console.log('Normal version initialize faild. Trying NOAVX version.')
            try {
                ppocr = __non_webpack_require__(ppocrObjPathNoAVX)
                noavx = true
            } catch (e2) {
                console.error(e2)
                parentPort.postMessage({
                    event: 'error',
                    message: e.message || e.stack ? e.stack.trim().split('\n')[0] : '未知错误',
                })
                await sleep(100)
                process.exit()
            }
        }
    }
    console.log('Loading models')
    try {
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
    } catch (e) {
        captureError(e)
        console.error(e)
        parentPort.postMessage({
            event: 'error',
            message: e.message || e.stack.trim() || '未知错误',
        })
        await sleep(100)
        process.exit()
    }
    console.log('Initialized')
    parentPort.postMessage({
        event: 'ready',
        message: {
            noavx,
        },
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
