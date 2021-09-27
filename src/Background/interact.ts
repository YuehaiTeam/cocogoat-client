import path from 'path'
import fsex from 'fs-extra'
import robot from 'robotjs'
import ioHook from 'iohook'
import { app, BrowserWindow, dialog, ipcMain, shell, session } from 'electron'
import { saveOptions } from './config'
import { config } from '@/typings/config'
import { windows, createArtifactView, createArtifactSwitch, createMapView, createMapScan } from './windows'
// @ts-ignore
import activeWindows from 'electron-active-window/build/Release/wm.node'
import { joystickInit, joystickStatus, joystickStop } from './joystick'
robot.setMouseDelay(8)
const getActiveWindow = activeWindows.getActiveWindow

export function interactInit() {
    ipcMain.on('ready', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        win && win.show()
    })
    ipcMain.on('minimizeApp', () => {
        windows.app && windows.app.minimize()
    })
    ipcMain.on('maximizeApp', () => {
        if (windows.app) {
            if (windows.app.isMaximized()) {
                windows.app.unmaximize()
            } else {
                windows.app.maximize()
            }
        }
    })

    ipcMain.on('getConfig', (event, { id }) => {
        event.reply(`getConfig-${id}`, config)
    })
    ipcMain.on('saveOptions', async (event, options) => {
        config.options = options
        saveOptions()
    })
    ipcMain.on('openExternal', (event, { url }) => {
        shell.openExternal(url)
    })
    ipcMain.on('clearStorageData', (event, { name, options }) => {
        const sess = session.fromPartition(name)
        sess.clearStorageData(options)
    })
    ipcMain.on('readArtifacts', async (event, { id }) => {
        try {
            const artifacts = await fsex.readJSON(path.join(config.configDir, 'artifacts.json'))
            event.reply(`readArtifacts-${id}`, artifacts)
        } catch (e) {
            event.reply(`readArtifacts-${id}`, [])
        }
    })
    ioHook.on('keydown', (event) => {
        windows.artifactView && windows.artifactView.webContents.send('keydown', event)
        windows.artifactSwitch && windows.artifactSwitch.webContents.send('keydown', event)
    })
    ioHook.on('mouseup', (event) => {
        windows.artifactView && windows.artifactView.webContents.send('mouseup', event)
    })
    ioHook.start()
    ipcMain.on('joystickInit', joystickInit)
    ipcMain.on('joystickStop', joystickStop)
    ipcMain.on('joystickStatus', (event, { id }) => {
        event.reply(`joystickStatus-${id}`, joystickStatus())
    })
    ipcMain.on('createArtifactView', createArtifactView)
    ipcMain.on('createMapView', createMapView)
    ipcMain.on('createMapScan', createMapScan)
    ipcMain.on('createArtifactSwitch', createArtifactSwitch)
    ipcMain.on('readyArtifactSwitch', () => {
        windows.artifactSwitch && windows.artifactSwitch.show()
    })
    ipcMain.on('readyArtifactView', () => {
        windows.artifactView && windows.artifactView.show()
        if (windows.app) {
            windows.app.minimize()
        }
    })
    ipcMain.on('closeArtifactView', () => {
        if (!windows.artifactView) return
        windows.artifactView.hide()
        try {
            windows.artifactView.webContents.closeDevTools()
        } catch (e) {
            // do nothing
        }
        windows.artifactView.close()
    })
    ipcMain.on('closeArtifactSwitch', () => {
        if (!windows.artifactSwitch) return
        windows.artifactSwitch.hide()
        try {
            windows.artifactSwitch.webContents.closeDevTools()
        } catch (e) {
            // do nothing
        }
        windows.artifactSwitch.close()
    })
    ipcMain.on('setTransparentArtifactSwitch', (event, { transparent }) => {
        if (!windows.artifactSwitch) return
        if (transparent) {
            windows.artifactSwitch.setIgnoreMouseEvents(true, { forward: true })
        } else {
            windows.artifactSwitch.setIgnoreMouseEvents(false)
        }
    })
    ipcMain.on('setTransparentArtifactView', (event, { transparent }) => {
        if (!windows.artifactView) return
        if (transparent) {
            windows.artifactView.setIgnoreMouseEvents(true, { forward: true })
        } else {
            windows.artifactView.setIgnoreMouseEvents(false)
        }
    })
    ipcMain.on('devtoolsApp', () => {
        if (!windows.app) return
        try {
            windows.app.webContents.openDevTools()
        } catch (e) {
            // do nothing
        }
    })
    ipcMain.on('devtoolsArtifactView', () => {
        if (!windows.artifactView) return
        try {
            windows.artifactView.webContents.openDevTools()
        } catch (e) {
            // do nothing
        }
    })
    ipcMain.on('devtoolsArtifactSwitch', () => {
        if (!windows.artifactSwitch) return
        try {
            windows.artifactSwitch.webContents.openDevTools()
        } catch (e) {
            // do nothing
        }
    })

    ipcMain.on('capture', (event, { x, y, w, h, id }) => {
        const t = robot.screen.capture(x, y, w, h)
        event.reply(`capture-${id}`, t.image)
    })
    ipcMain.on('getPosition', (event, { id }) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        win && event.reply(`getPosition-${id}`, win.getPosition())
    })
    ipcMain.on('getArtifactViewPosition', (event, { id }) => {
        if (!windows.artifactView) return
        event.reply(`getArtifactViewPosition-${id}`, windows.artifactView.getPosition())
    })
    ipcMain.on('getArtifactSwitchPosition', (event, { id }) => {
        if (!windows.artifactSwitch) return
        event.reply(`getArtifactSwitchPosition-${id}`, windows.artifactSwitch.getPosition())
    })
    ipcMain.on('getActiveWindow', async (event, { id }) => {
        event.reply(`getActiveWindow-${id}`, await getActiveWindow())
    })
    ipcMain.on('getAppWindowId', (event, { id }) => {
        event.reply(`getAppWindowId-${id}`, windows.app ? windows.app.webContents.id : -1)
    })
    ipcMain.on('getArtifactViewWindowId', (event, { id }) => {
        event.reply(`getArtifactViewWindowId-${id}`, windows.artifactView ? windows.artifactView.webContents.id : -1)
    })
    ipcMain.on('getMapViewWindowId', (event, { id }) => {
        event.reply(`getMapViewWindowId-${id}`, windows.mapView ? windows.mapView.webContents.id : -1)
    })
    ipcMain.on(
        'mouseClick',
        (event, { x: dx, y: dy, delay, id }: { x: number; y: number; id: number; delay?: number }) => {
            robot.moveMouse(dx, dy)
            setTimeout(() => {
                robot.mouseClick()
                event.reply(`mouseClick-${id}`)
            }, delay || 50)
        },
    )
    ipcMain.on('showSaveDialog', async (event, { id, options }) => {
        const res = await dialog.showSaveDialog(options)
        event.reply(`showSaveDialog-${id}`, res)
    })
    ipcMain.on('exit', () => {
        app.exit()
    })
}
