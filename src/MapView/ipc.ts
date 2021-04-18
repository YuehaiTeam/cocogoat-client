import { ipcRenderer } from 'electron'
export { getConfig } from '@/App/ipc'
export function devtools() {
    ipcRenderer.send('devtools')
}
export function openSync() {
    ipcRenderer.send('createMapScan')
}
