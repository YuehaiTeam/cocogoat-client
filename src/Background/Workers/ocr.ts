import path from 'path'
import util from 'util'
import fsex from 'fs-extra'
import stream from 'stream'
import { config } from './index'
import { parentPort } from 'worker_threads'
import { IocrResult } from '@/typings/ocr'
const pipeline = util.promisify(stream.pipeline)
let ppocr: any
function copy(fr: string, to: string) {
    return pipeline(fsex.createReadStream(fr), fsex.createWriteStream(to))
}
export async function ocrWorkerInit(data: { rec: string; det: string; dic: string }) {
    if (!parentPort) return
    let { rec, det, dic } = data
    /* 包含非ASCII字符时才使用虚拟路径，减少正常情况下损失 */
    if (/[^\x00-\x7F]/.test(dic)) {
        try {
            const virtualPath = 'C:\\cocogoat'
            console.log('enigmavb found, read model from virtual folder', virtualPath)
            /*
             * 这个虚拟文件夹和里面与OCR模型对应的虚拟文件会由enigma virtual box（打包工具）在运行时创建，配置位于build/evb-templates
             * 如果存在这个文件夹，即认为正在单文件运行，此时将模型复制到虚拟文件夹以解决PaddleOCR不支持中文路径模型的问题
             * 若过程出错或者不是单文件运行，则依然直接读取模型文件
             */
            await fsex.access(virtualPath)
            const vrec = path.join(virtualPath, 'rec')
            const vdet = path.join(virtualPath, 'det')
            const vdic = path.join(virtualPath, 'dic.txt')

            /* 此处依次处理，同时复制偶尔会导致enigmavb崩溃 */
            await copy(path.join(det, 'inference.pdmodel'), path.join(vdet, 'inference.pdmodel'))
            await copy(path.join(det, 'inference.pdiparams'), path.join(vdet, 'inference.pdiparams'))
            await copy(path.join(rec, 'inference.pdmodel'), path.join(vrec, 'inference.pdmodel'))
            await copy(path.join(rec, 'inference.pdiparams'), path.join(vrec, 'inference.pdiparams'))
            await copy(dic, vdic)

            rec = vrec
            det = vdet
            dic = vdic
            console.log('virtual folder created', rec)
        } catch (e) {
            console.log('enigmavb copy error or not found, fallback to read model directly', e)
        }
    } else {
        console.log('no non-ascii characters in path, read model directly')
    }

    const ppocrObjPath = path.join(config.dataDir, 'paddleocr', 'ppocr.node')
    ppocr = __non_webpack_require__(ppocrObjPath)
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
