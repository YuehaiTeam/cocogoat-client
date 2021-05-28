import path from 'path'
import fsex from 'fs-extra'
import { Worker } from 'worker_threads'
import { dialog, ipcMain, webContents, IpcMainEvent } from 'electron'
import { config } from '@/typings/config'
import Queue from 'queue'
import util from 'util'
import stream from 'stream'
import { windows } from './windows'
const pipeline = util.promisify(stream.pipeline)
function copy(fr: string, to: string) {
    return pipeline(fsex.createReadStream(fr), fsex.createWriteStream(to))
}
let ocrWorker: Worker[] = []
let workerReadyPms: Promise<void>[] = []
let ocrReady: Promise<any> | null
let workerPtr: number = 0
let ocrRunning = false
let onOcrEvent: any
const workerCount = 8
const q = Queue({
    concurrency: workerCount,
    autostart: true,
    timeout: 10e3,
})
export async function ocrInit() {
    if (ocrRunning) return
    ocrRunning = true
    workerPtr = 0
    ocrWorker = []
    workerReadyPms = []
    let ocrData = path.join(config.dataDir, 'ppocr-data')
    const ocrUserData = path.join(config.configDir, 'ppocr-data')
    try {
        await fsex.access(path.join(ocrUserData, 'rec'))
        await fsex.access(path.join(ocrUserData, 'det'))
        await fsex.access(path.join(ocrUserData, 'dic.txt'))
        dialog.showMessageBox({
            type: 'info',
            title: '自定义OCR训练集',
            message: '当前已加载用户自定义OCR训练集。如果你不知道发生了什么，请联系开发者。',
            buttons: ['好的'],
        })
        ocrData = ocrUserData
    } catch (e) {}
    console.log('OCR Datadir is ', ocrData)
    let rec = path.join(ocrData, 'rec')
    let det = path.join(ocrData, 'det')
    let dic = path.join(ocrData, 'dic.txt')
    /* 包含非ASCII字符时才使用虚拟路径，减少正常情况下损失 */
    if (/[^\x00-\x7F]/.test(dic)) {
        try {
            console.log('non-ascii characters found in path, creating virtual folder')
            /*
             * 这个虚拟文件夹和里面与OCR模型对应的虚拟文件会由enigma virtual box（打包工具）在运行时创建，配置位于build/evb-templates
             * 如果存在这个文件夹，即认为正在单文件运行，此时将模型复制到虚拟文件夹以解决PaddleOCR不支持中文路径模型的问题
             * 若过程出错或者不是单文件运行，则依然直接读取模型文件
             */
            const virtualPath = 'C:\\cocogoat'
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
    let noavx = false
    for (let i = 0; i < workerCount; i++) {
        workerReadyPms.push(
            new Promise((resolve, reject) => {
                const worker = new Worker(
                    path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), 'background_worker.js'),
                    {
                        workerData: {
                            worker: 'ppocr',
                            name: `ocr-${i}`,
                            data: {
                                rec,
                                det,
                                dic,
                                noavx,
                            },
                            config,
                        },
                    },
                )
                worker.on(
                    'message',
                    ({ event, message, reply, id }: { event: string; message: any; reply?: any; id?: string }) => {
                        if (event === 'ready') {
                            noavx = message.noavx
                            resolve()
                        }
                        if (event === 'reply' && id && reply) {
                            const win = webContents.fromId(reply.window)
                            if (win) {
                                webContents.fromId(reply.window).send(`${reply.event}-${id}`, message)
                            } else {
                                console.log('Window', win, 'not found')
                            }
                        }
                        if (event === 'error') {
                            dialog.showMessageBox({
                                type: 'error',
                                title: 'OCR模块加载失败',
                                message: `如果你不知道发生了什么，请联系开发者。错误信息：${message}`,
                                buttons: ['好的'],
                            })
                            windows.artifactView && windows.artifactView.close()
                            return
                        }
                    },
                )
                worker.on('error', reject)
                ocrWorker.push(worker)
            }),
        )
        if (i === 0) {
            await workerReadyPms[0]
            console.log('first worker loadd successfully')
        }
    }
    onOcrEvent = async (event: IpcMainEvent, { image, id }: { image: string; id: string }) => {
        await ocrReady
        let workerId = workerPtr++ % workerCount
        if (workerId > workerCount - 1) workerId = 0
        q.push((cb) => {
            console.log(`Worker ${workerId} processing`)
            ocrWorker[workerId].postMessage({
                event: 'ocr',
                message: {
                    image,
                },
                id,
                reply: {
                    window: event.sender.id,
                    event: 'ocr',
                },
            })
            ocrWorker[workerId].once('message', () => {
                // @ts-ignore
                cb()
            })
        })
    }
    ipcMain.on('ocr', onOcrEvent)
    ocrReady = Promise.all(workerReadyPms)
    ocrReady.then(() => {
        console.log('ocr ready')
    })
}
export async function ocrStop() {
    if (ocrReady) {
        await ocrReady
    }
    ocrRunning = false
    ipcMain.off('ocr', onOcrEvent)
    const p = []
    for (const i of ocrWorker) {
        i.postMessage({ event: 'exit' })
        p.push(
            new Promise((resolve) => {
                i.on('exit', resolve)
            }),
        )
    }
    await Promise.all(p)
    console.log('ocr stopped')
}
