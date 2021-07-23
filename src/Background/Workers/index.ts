import { IConfig, EBuild } from '@/typings/config'
import { workerData } from 'worker_threads'
import { ocrWorkerInit } from './ocr'
import { mapcvWorkerInit } from './mapcv'
import { joystickWorkerInit } from './joystick'
import { logHook } from '../Utils/LogHook'
import * as Sentry from '@sentry/node'
logHook()
export const config: IConfig = workerData.config
if (config.options.sendErrorReports && process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: process.env.VUE_APP_SENTRY,
        environment: config.build ? config.build.type : 'DEV',
        release: config.build && config.build.type === EBuild.REL ? config.version : 'dev',
    })
}
export function captureError(e: any) {
    if (config.options.sendErrorReports && process.env.NODE_ENV !== 'development') {
        Sentry.captureException(e)
    }
}
console.log('Worker started :', workerData.worker)
console.log('Worker started')
switch (workerData.worker) {
    case 'ppocr':
        ocrWorkerInit(workerData.data)
        break
    case 'mapcv':
        mapcvWorkerInit()
        break
    case 'joystick':
        joystickWorkerInit()
        break
    default:
        console.log('unknown worker')
}
