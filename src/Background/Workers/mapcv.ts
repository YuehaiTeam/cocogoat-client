import path from 'path'
import { config } from './index'
import { parentPort } from 'worker_threads'

let cv: any

export function mapcvWorkerInit() {
    if (!parentPort) return
    const ppocrObjPath = path.join(config.dataDir, 'opencv', 'opencv4nodejs452.node')
    cv = __non_webpack_require__(ppocrObjPath)
    console.log(cv)
}
