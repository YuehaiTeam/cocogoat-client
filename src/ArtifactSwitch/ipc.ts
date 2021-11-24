// @ts-ignore
import { v4 as uuid } from 'uuid'
import { ipcRenderer } from 'electron'
import { sleep } from '@/ArtifactView/utils'
import { Artifact } from '@/typings/Artifact'
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

export async function getArtifactViewWindowId(): Promise<number> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`getArtifactViewWindowId-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('getArtifactViewWindowId', { id })
    const winAppId = Number(await p)
    return winAppId
}

export async function getAppWindowId(): Promise<number> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`getAppWindowId-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('getAppWindowId', { id })
    const winAppId = Number(await p)
    return winAppId
}

export async function tryocr(): Promise<Artifact | null> {
    const artifactViewWindowId = await getArtifactViewWindowId()
    if (artifactViewWindowId < 0) {
        return null
    }
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`tryocr-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.sendTo(artifactViewWindowId, 'tryocr', { id })
    return <Artifact>await p
}

export async function tryocrSec(): Promise<null | [Promise<void>, Promise<Artifact>]> {
    console.log('tryocrsec')
    const artifactViewWindowId = await getArtifactViewWindowId()
    console.log('tryocrsec2')
    if (artifactViewWindowId < 0) {
        return null
    }
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`tryocr-${id}`, (result, data) => resolve(data))
    })
    const q = new Promise((resolve) => {
        ipcRenderer.once(`tryocr-${id}-capture`, (result, data) => resolve(data))
    })
    ipcRenderer.sendTo(artifactViewWindowId, 'tryocr', { id })
    return [<Promise<void>>q, <Promise<Artifact>>p]
}

export async function click({ x, y }: { x: number; y: number }) {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`mouseClick-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('mouseClick', { x, y, id })
    await p
    return
}

export async function joystickStatus(): Promise<Boolean> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`joystickStatus-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('joystickStatus', { id })
    return <Boolean>await p
}
export async function joystickNext() {
    ipcRenderer.send('joystick', { event: 'keydown', data: { rawcode: 39 } })
    await sleep(50)
    ipcRenderer.send('joystick', { event: 'keyup', data: { rawcode: 39 } })
    return
}
export async function syncArtifact(artifact: Artifact) {
    const appWindowId = await getAppWindowId()
    if (appWindowId < 0) {
        return null
    }
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`syncArtifact-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.sendTo(appWindowId, 'syncArtifact', { id, artifact })
    return await p
}
