import { app, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { ocrInit, ocrStop } from './ocr'
import path from 'path'
import { config } from '@/typings/config'
export const windows = <Record<string, BrowserWindow | null>>{
    app: null,
    artifactView: null,
    artifactSwitch: null,
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
        maximizable: false,
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
        if (!config.options.artifacts.preserveSwitcher && windows.artifactSwitch) {
            windows.artifactSwitch.close()
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
export async function createArtifactSwitch() {
    if (windows.artifactSwitch) {
        windows.artifactSwitch.focus()
        return
    }
    windows.artifactSwitch = new BrowserWindow({
        width: 888,
        height: 810,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        maximizable: false,
        webPreferences: {
            // @ts-ignore
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        },
        show: false,
    })
    windows.artifactSwitch.on('close', () => {
        windows.artifactSwitch = null
    })
    windows.artifactSwitch.on('closed', () => {
        windows.artifactSwitch = null
    })
    const params =
        `dataDir=${encodeURIComponent(path.join(__dirname, '..', 'data'))}` +
        `&windowAppId=${windows.app ? windows.app.webContents.id : -1}` +
        `&windowArtifactViewId=${windows.artifactView ? windows.artifactView.webContents.id : -1}`
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await windows.artifactSwitch.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}ArtifactSwitch.html?${params}`)
        if (!process.env.IS_TEST) windows.artifactSwitch.webContents.openDevTools()
    } else {
        windows.artifactSwitch.loadURL('app://./ArtifactSwitch.html?' + params)
    }
}
