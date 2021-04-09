import path from 'path'
import fsex from 'fs-extra'
import { app, protocol } from 'electron'
import { interactInit } from './Background/interact'
import { createWindow } from './Background/windows'
import { config } from './typings/config'

const isDevelopment = process.env.NODE_ENV !== 'production'
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])
app.on('window-all-closed', () => {
    app.quit()
})
app.on('ready', async () => {
    const currentPath = app.getAppPath()
    const appdataPath = app.getPath('userData')
    try {
        await fsex.access(path.join(currentPath, 'cocogoat'))
        config.configDir = path.join(currentPath, 'cocogoat')
    } catch (e) {
        config.configDir = path.join(appdataPath, 'config')
        await fsex.ensureDir(config.configDir)
    }
    try {
        config.options = await fsex.readJSON(path.join(config.configDir, 'options.json'))
    } catch (e) {
        await fsex.writeJSON(path.join(config.configDir, 'options.json'), config.options)
    }
    createWindow()
    interactInit()
})
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
