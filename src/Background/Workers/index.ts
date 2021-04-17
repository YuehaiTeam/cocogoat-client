import { IConfig } from '@/typings/config'
import { workerData } from 'worker_threads'
import { ocrWorkerInit } from './ocr'
export const config: IConfig = workerData.config
console.log('Worker started :', workerData.worker)
switch (workerData.worker) {
    case 'ppocr':
        ocrWorkerInit(workerData.data)
        break
    default:
        console.log('unknown worker')
}
