// @ts-ignore
import { v4 as uuid } from 'uuid'
import { ipcRenderer } from 'electron'
export { getConfig } from '@/App/ipc'
export { capture } from '@/ArtifactView/ipc'
export function close() {
    ipcRenderer.send('closeArtifactSwitch')
}
export function devtools() {
    ipcRenderer.send('devtoolsArtifactSwitch')
}

export function setTransparent(t: boolean) {
    ipcRenderer.send('setTransparentArtifactSwitch', { transparent: t })
}

export async function getposition(): Promise<number[]> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`getArtifactSwitchPosition-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('getArtifactSwitchPosition', { id })
    return <number[]>await p
}

export async function tryocr(): Promise<void> {
    const artifactViewWindowId = Number(new URLSearchParams(location.search).get('windowArtifactViewId'))
    if (artifactViewWindowId < 0) {
        return
        // throw new Error('圣遗物识别器未打开')
    }
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`tryocr-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.sendTo(artifactViewWindowId, 'tryocr', { id })
    await p
    return
}

export async function click({ x, y }: { x: number; y: number }) {
    ipcRenderer.send('mouseClick', { x, y })
}
