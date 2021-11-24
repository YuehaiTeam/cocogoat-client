// @ts-ignore
import { v4 as uuid } from 'uuid'
import { ipcRenderer } from 'electron'
import { IocrResult } from '@/typings/ocr'
import { sleep } from './utils'
export { getConfig } from '@/App/ipc'
interface IactiveWindow {
    os: string
    windowClass: string
    windowName: string
    windowPid: string
    idleTime: string
}
export async function capture(x: number, y: number, w: number, h: number) {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`capture-${id}`, (result, buffer) => resolve(buffer))
    })
    ipcRenderer.send('capture', { x, y, w, h, id })
    const buffer = <Uint8Array>await p
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported!')
    const imgData = ctx.createImageData(w, h)
    for (let i = 0; i < buffer.length; i += 4) {
        imgData.data[i + 0] = buffer[i + 2] // red
        imgData.data[i + 1] = buffer[i + 1] // green
        imgData.data[i + 2] = buffer[i + 0] // blue
        imgData.data[i + 3] = buffer[i + 3] // alpha
    }
    ctx.putImageData(imgData, 0, 0)
    return canvas
}
export async function getposition(): Promise<number[]> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`getArtifactViewPosition-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('getArtifactViewPosition', { id })
    return <number[]>await p
}
export async function getActiveWindow(): Promise<IactiveWindow> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`getActiveWindow-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('getActiveWindow', { id })
    return <IactiveWindow>await p
}
export async function ocr(image: string | Record<string, any>): Promise<IocrResult[]> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`ocr-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('ocr', { image, id })
    return <IocrResult[]>await p
}
export function close() {
    ipcRenderer.send('closeArtifactView')
}
export function devtools() {
    ipcRenderer.send('devtoolsArtifactView')
}
export function createArtifactSwitch() {
    ipcRenderer.send('createArtifactSwitch')
}
let winAppId: number = -1
export async function sendToAppWindow(channel: string, data: any): Promise<void> {
    const id = uuid()
    if (winAppId < 0) {
        const p = new Promise((resolve) => {
            ipcRenderer.once(`getAppWindowId-${id}`, (result, data) => resolve(data))
        })
        ipcRenderer.send('getAppWindowId', { id })
        winAppId = Number(await p)
    }
    ipcRenderer.sendTo(winAppId, channel, data)
}
export function setTransparent(t: boolean) {
    ipcRenderer.send('setTransparentArtifactView', { transparent: t })
}

export async function click({ x, y }: { x: number; y: number }) {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`mouseClick-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('mouseClick', { x, y, id })
    await p
    await sleep(200)
    return
}
