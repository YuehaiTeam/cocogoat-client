import path from 'path'
import { Worker } from 'worker_threads'
import { config } from '@/typings/config'
import iohook from 'iohook'
import { ipcMain } from 'electron'
let joystickRunning = false
let worker: Worker | null = null
function onkeydown(ev: any) {
    if (worker) {
        worker.postMessage({
            event: 'keydown',
            data: ev,
        })
    }
}
function onkeyup(ev: any) {
    if (worker) {
        worker.postMessage({
            event: 'keyup',
            data: ev,
        })
    }
}
function onev(ev: any, msg: any) {
    if (worker) {
        worker.postMessage(msg)
    }
}
export async function joystickInit() {
    if (joystickRunning) {
        return
    }
    joystickRunning = true
    worker = new Worker(path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), 'background_worker.js'), {
        workerData: {
            worker: 'joystick',
            name: `joystick`,
            data: {},
            config,
        },
    })
    iohook.on('keydown', onkeydown)
    iohook.on('keyup', onkeyup)
    ipcMain.on('joystick', onev)
}
export async function joystickStop() {
    if (!joystickRunning || !worker) {
        return
    }
    iohook.off('keydown', onkeydown)
    iohook.off('keyup', onkeyup)
    ipcMain.off('joystick', onev)
    joystickRunning = false
    worker.postMessage({
        event: 'exit',
    })
    worker = null
}
export function joystickStatus() {
    if (!joystickRunning || !worker) {
        return false
    }
    return true
}
