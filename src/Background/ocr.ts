import path from 'path'
import fsex from 'fs-extra'
import { dialog, ipcMain } from 'electron'
import { createWorker, createScheduler, Worker, Scheduler, OEM } from 'tesseract.js'
import { config } from '@/typings/config'
const workerCount = 5
let scheduler: Scheduler | null
let ocrWorker: Worker[] = []
let workerReadyPms: Promise<void>[] = []
let ocrReady: Promise<any> | null
export async function ocrInit() {
    if (scheduler) return
    let ocrData = path.join(config.dataDir, 'lang-data')
    const ocrUserData = path.join(config.configDir, 'lang-data')
    try {
        await fsex.access(path.join(ocrUserData, 'chi_sim.traineddata'))
        dialog.showMessageBox({
            type: 'info',
            title: '自定义OCR训练集',
            message: '当前已加载用户自定义OCR训练集。如果你不知道发生了什么，请联系开发者。',
            buttons: ['好的'],
        })
        ocrData = ocrUserData
    } catch (e) {}
    console.log('OCR Datadir is ', ocrData)
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
