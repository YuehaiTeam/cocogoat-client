// @ts-ignore
import { v4 as uuid } from 'uuid'
import { ipcRenderer, SaveDialogReturnValue } from 'electron'
import { IConfig } from '@/typings/config'
import { Artifact } from '@/typings/Artifact'
import { SaveDialogOptions } from 'electron/main'
export function openArtifactView() {
    ipcRenderer.send('createArtifactView')
}

export function upgrade(url: string, patch = false) {
    ipcRenderer.send('doUpgrade', { url, patch })
}
export function openExternal(url: string) {
    ipcRenderer.send('openExternal', { url })
}

export async function getApphash(): Promise<IConfig> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`getApphash-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('getApphash', { id })
    return <IConfig>await p
}

export async function getConfig(): Promise<IConfig> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`getConfig-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('getConfig', { id })
    return <IConfig>await p
}
export async function readArtifacts(): Promise<Artifact[]> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`readArtifacts-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('readArtifacts', { id })
    return <Artifact[]>await p
}
export async function showSaveDialog(options: SaveDialogOptions) {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`showSaveDialog-${id}`, (result, data) => resolve(data))
    })
    ipcRenderer.send('showSaveDialog', { id, options })
    return <SaveDialogReturnValue>await p
}
export async function checkDwmIsCompositionEnabled(): Promise<boolean> {
    const id = uuid()
    const p = new Promise((resolve, reject) => {
        ipcRenderer.once(`checkDwmIsCompositionEnabled-${id}`, (result, data) => {
            if (data.error) {
                return reject(new Error(`WinAPI Error: 0x${data.error.toString(16)}`))
            }
            resolve(data.enabled)
        })
    })
    ipcRenderer.send('checkDwmIsCompositionEnabled', { id })
    return <boolean>await p
}
export async function checkVCRedistInstalled(): Promise<boolean> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`checkVCRedistInstalled-${id}`, (result, data) => {
            resolve(data)
        })
    })
    ipcRenderer.send('checkVCRedistInstalled', { id })
    return <boolean>await p
}

export async function checkViGEmInstalled(): Promise<boolean> {
    const id = uuid()
    const p = new Promise((resolve) => {
        ipcRenderer.once(`checkViGEmInstalled-${id}`, (result, data) => {
            resolve(data)
        })
    })
    ipcRenderer.send('checkViGEmInstalled', { id })
    return <boolean>await p
}
