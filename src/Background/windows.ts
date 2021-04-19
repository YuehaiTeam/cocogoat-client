import { app, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { ocrInit, ocrStop } from './ocr'
import { config } from '@/typings/config'
import { loadState, saveState, createTemplateWindow } from './Utils/windowHelper'
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
            webviewTag: true,
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
    createTemplateWindow(
        'artifactView',
        {
            ...loadState('artifactView', 410, 810),
            transparent: true,
            alwaysOnTop: true,
            maximizable: false,
        },
        () => {
            saveState('artifactView')
            windows.artifactView = null
            if (windows.app && windows.app.isMinimized()) {
                windows.app.restore()
            }
            if (!config.options.artifacts.preserveSwitcher && windows.artifactSwitch) {
                windows.artifactSwitch.close()
            }
            ocrStop()
        },
    )
    ocrInit()
}
export async function createArtifactSwitch() {
    createTemplateWindow(
        'artifactSwitch',
        {
            ...loadState('artifactSwitch', 888, 810),
            transparent: true,
            alwaysOnTop: true,
            maximizable: false,
        },
        () => {
            saveState('artifactSwitch')
        },
    )
}
