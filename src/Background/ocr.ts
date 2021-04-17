import path from 'path'
import fsex from 'fs-extra'
import { Worker } from 'worker_threads'
import { dialog, ipcMain, webContents } from 'electron'
import { config } from '@/typings/config'
import Queue from 'queue'
let ocrWorker: Worker[] = []
let workerReadyPms: Promise<void>[] = []
let ocrReady: Promise<any> | null
let workerPtr: number = 0
const workerCount = 1
const q = Queue({
    concurrency: workerCount,
    autostart: true,
    timeout: 10e3,
})
export async function ocrInit() {
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

    for (let i = 0; i < workerCount; i++) {
        workerReadyPms.push(
            new Promise((resolve, reject) => {
                const worker = new Worker(
                    path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), 'background_worker.js'),
                    {
                        workerData: {
                            worker: 'ppocr',
                            data: {
                                rec: path.join(ocrData, 'rec'),
                                det: path.join(ocrData, 'det'),
                                dic: path.join(ocrData, 'dic.txt'),
                            },
                            config,
                        },
                    },
                )
                worker.on(
                    'message',
                    ({ event, message, reply, id }: { event: string; message: any; reply?: any; id?: string }) => {
                        if (event === 'ready') {
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
                    },
                )
                worker.on('error', reject)
                ocrWorker.push(worker)
            }),
        )
    }
    ipcMain.on('ocr', async (event, { image, id }: { image: string; id: string }) => {
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
    })
    ocrReady = Promise.all(workerReadyPms)
    ocrReady.then(() => {
        console.log('ocr ready')
    })
}
export async function ocrStop() {
    await ocrReady
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
