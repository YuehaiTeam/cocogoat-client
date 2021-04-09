import { app, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { ocrInit, ocrStop } from './ocr'
export const windows = <Record<string, BrowserWindow | null>>{
    app: null,
    artifactView: null,
}

export async function createWindow() {
    windows.app = new BrowserWindow({
        width: 990,
        height: 720,
        frame: false,
        webPreferences: {
            // @ts-ignore
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        },
        show: false,
    })
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await windows.app.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) windows.app.webContents.openDevTools()
    } else {
        createProtocol('app')
        windows.app.loadURL('app://./index.html')
    }
    windows.app.on('close', () => {
        app.exit()
    })
}
export async function createArtifactView() {
    if (windows.artifactView) {
        if (windows.artifactView) {
            windows.artifactView.focus()
        }
        return
    }
    windows.artifactView = new BrowserWindow({
        width: 410,
        height: 810,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            // @ts-ignore
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        },
        show: false,
    })
    windows.artifactView.on('close', () => {
        windows.artifactView = null
        if (windows.app && windows.app.isMinimized()) {
            windows.app.restore()
        }
        ocrStop()
    })
    windows.artifactView.on('closed', () => {
        windows.artifactView = null
    })
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await windows.artifactView.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}ArtifactView.html`)
        if (windows.app) {
            windows.artifactView.webContents.executeJavaScript('window.creatorId = ' + windows.app.webContents.id + ';')
        }
        if (!process.env.IS_TEST) windows.artifactView.webContents.openDevTools()
    } else {
        windows.artifactView.loadURL('app://./ArtifactView.html')
    }
    ocrInit()
}
