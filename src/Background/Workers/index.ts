import { IConfig } from '@/typings/config'
import { workerData } from 'worker_threads'
import { ocrWorkerInit } from './ocr'
import { mapcvWorkerInit } from './mapcv'
export const config: IConfig = workerData.config
console.log('Worker started :', workerData.worker)
switch (workerData.worker) {
    case 'ppocr':
        ocrWorkerInit(workerData.data)
        break
    case 'mapcv':
        mapcvWorkerInit()
        break
    default:
        console.log('unknown worker')
}
