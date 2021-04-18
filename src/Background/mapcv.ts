import path from 'path'
import { Worker } from 'worker_threads'
import { ipcMain, webContents } from 'electron'
import { config } from '@/typings/config'
import Queue from 'queue'
let mapcvWorker: Worker[] = []
let workerReadyPms: Promise<void>[] = []
let workerInitPms: Promise<void>[] = []
let mapcvReady: Promise<any> | null
let mapcvDone: Promise<any> | null
let mapcvDoneFun: () => void = () => {}
let workerPtr: number = 0
const workerCount = 1
const q = Queue({
    concurrency: 10 * workerCount,
    autostart: true,
    timeout: 2e3,
})
export async function mapcvInit() {
    workerPtr = 0
    mapcvWorker = []
    workerReadyPms = []
    workerInitPms = []
    for (let i = 0; i < workerCount; i++) {
        workerReadyPms.push(
            new Promise((resolve, reject) => {
                const worker = new Worker(
                    path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), 'background_worker.js'),
                    {
                        workerData: {
                            worker: 'mapcv',
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
                mapcvWorker.push(worker)
            }),
        )
    }
    ipcMain.on('mapcvInit', async (event, { image, id }: { image: string; id: string }) => {
        await mapcvReady
        for (const worker of mapcvWorker) {
            workerInitPms.push(
                new Promise((resolve) => {
                    worker.postMessage({
                        event: 'mapcvInit',
                        message: {
                            image,
                        },
                        id,
                        reply: {
                            window: event.sender.id,
                            event: 'mapcvInit',
                        },
                    })

                    worker.once('message', () => {
                        // @ts-ignore
                        resolve()
                    })
                }),
            )
        }
        await Promise.all(workerInitPms)
        mapcvDoneFun()
    })
    ipcMain.on('mapcv', async (event, { image, id }: { image: string; id: string }) => {
        await mapcvDone
        let workerId = workerPtr++ % workerCount
        if (workerId > workerCount - 1) workerId = 0
        q.push((cb) => {
            mapcvWorker[workerId].postMessage({
                event: 'mapcv',
                message: {
                    image,
                },
                id,
                reply: {
                    window: event.sender.id,
                    event: 'mapcv',
                },
            })
            mapcvWorker[workerId].once('message', () => {
                // @ts-ignore
                cb()
            })
        })
    })
    mapcvReady = Promise.all(workerReadyPms)
    mapcvReady.then(() => {
        console.log('mapcv ready')
    })
    mapcvDone = new Promise((resolve) => {
        mapcvDoneFun = () => {
            resolve()
        }
    }) as Promise<void>
}
export async function mapcvStop() {
    await mapcvReady
    const p = []
    for (const i of mapcvWorker) {
        i.postMessage({ event: 'exit' })
        p.push(
            new Promise((resolve) => {
                i.on('exit', resolve)
            }),
        )
    }
    await Promise.all(p)
    console.log('mapcv stopped')
}
