// @ts-ignore
import { v4 as uuid } from 'uuid'
import { ipcRenderer } from 'electron'
export { getConfig } from '@/App/ipc'
export function devtools() {
    ipcRenderer.send('devtools')
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
        ipcRenderer.once(`getPosition-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('getPosition', { id })
    return <number[]>await p
}

export async function mapcvInit(image: Record<string, any>): Promise<boolean> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`mapcvInit-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('mapcvInit', { image, id })
    return <boolean>await p
}

export async function mapcv(image: Record<string, any>): Promise<any> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`mapcv-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('mapcv', { image, id })
    return <any>await p
}

export async function sendToMapWindow(channel: string, data: any): Promise<void> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`getMapViewWindowId-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('getMapViewWindowId', { id })
    const windowId = Number(await p)
    ipcRenderer.sendTo(windowId, channel, data)
}
