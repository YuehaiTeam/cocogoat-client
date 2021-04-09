import path from 'path'
import { ipcMain } from 'electron'
import { createWorker, createScheduler, Worker, Scheduler, OEM } from 'tesseract.js'
const workerCount = 5
let scheduler: Scheduler | null
let ocrWorker: Worker[] = []
let workerReadyPms: Promise<void>[] = []
let ocrReady: Promise<any> | null
export function ocrInit() {
    if (scheduler) return
    const ocrData = path.join(__dirname, '..', 'data', 'lang-data')
    scheduler = createScheduler()
    for (let i = 0; i < workerCount; i++) {
        const worker = createWorker({
            langPath: ocrData,
            cacheMethod: 'none',
            gzip: false,
        })
        workerReadyPms.push(
            (async function ocrload() {
                await worker.load()
                await worker.loadLanguage('chi_sim')
                await worker.initialize('chi_sim', OEM.LSTM_ONLY)
                await worker.setParameters({
                    tessjs_create_hocr: '0',
                    tessjs_create_box: '0',
                    tessjs_create_unlv: '0',
                    tessjs_create_osd: '0',
                    tessjs_create_tsv: '0',
                })
            })(),
        )
        scheduler.addWorker(worker)
        ocrWorker.push(worker)
    }
    ocrReady = Promise.all(workerReadyPms)
    ipcMain.on('ocr', async (event, { image, id }: { image: string; id: string }) => {
        await ocrReady
        if (!scheduler) return
        const result = await scheduler.addJob('recognize', image, {}, id)
        event.reply(`ocr-${id}`, result)
    })
    ocrReady.then(() => {
        console.log('ocr ready')
    })
}
export async function ocrStop() {
    await ocrReady
    if (!scheduler) return
    ipcMain.removeAllListeners('ocr')
    const p = scheduler.terminate()
    scheduler = null
    ocrWorker = []
    workerReadyPms = []
    await p
    console.log('ocr stopped')
}
