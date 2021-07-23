import merge from 'lodash/merge'
import { windows } from '../windows'
import { saveOptions } from '../config'
import { config, IwindowStates } from '@/typings/config'
import { BrowserWindow, BrowserWindowConstructorOptions, screen } from 'electron'
export function loadState(name: string, width: number, height: number) {
    const state: IwindowStates = config.options.windowStates[name] || { width, height }
    console.log(state)
    if (state.x && state.y) {
        const currScreen = screen.getDisplayNearestPoint({ x: state.x, y: state.y })
        if (
            !(state.x > currScreen.bounds.x && state.x < currScreen.size.width) ||
            !(state.y > currScreen.bounds.y && state.y < currScreen.size.height)
        ) {
            state.x = currScreen.bounds.x
            state.y = currScreen.bounds.y
        }
    }
    return state
}
export function saveState(name: string) {
    const win = windows[name]
    if (!win) return
    config.options.windowStates[name] = win.getBounds()
    saveOptions()
}
export function createTemplateWindow(
    name: string,
    options: Partial<BrowserWindowConstructorOptions>,
    onClose?: (win: BrowserWindow) => any,
) {
    const origWin = windows[name]
    if (origWin) {
        origWin.show()
        origWin.focus()
        return
    }
    options.webPreferences = merge(options.webPreferences, {
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        contextIsolation: false,
    })
    const newWin = new BrowserWindow({
        frame: false,
        show: false,
        ...options,
    })
    newWin.on('close', () => {
        onClose && onClose(newWin)
        windows[name] = null
    })
    newWin.on('closed', () => {
        windows[name] = null
    })
    const htmlName = name.charAt(0).toUpperCase() + name.slice(1)
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        newWin.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}${htmlName}.html`)
        newWin.webContents.openDevTools()
    } else {
        newWin.loadURL(`app://./${htmlName}.html`)
    }
    windows[name] = newWin
    return newWin
}
