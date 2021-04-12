import path from 'path'
import fsex from 'fs-extra'
import { app, protocol } from 'electron'
import * as Sentry from '@sentry/electron'
import { interactInit } from './Background/interact'
import { createWindow } from './Background/windows'
import { config, EBuild } from './typings/config'
import { automateInit } from './Background/automate'
import { upgradeInit } from './Background/upgrade'

const isDevelopment = process.env.NODE_ENV !== 'production'
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true } },
])
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
        config.options = Object.assign(config.options, await fsex.readJSON(path.join(config.configDir, 'options.json')))
    } catch (e) {
        await fsex.writeJSON(path.join(config.configDir, 'options.json'), config.options)
    }
    try {
        config.dataDir = path.join(path.dirname(app.getAppPath()), 'data')
        config.build = await fsex.readJSON(path.join(config.dataDir, 'build.json'))
    } catch (e) {
        console.log(e)
        config.build = { type: EBuild.DEV, timestamp: Date.now() }
    }
    config.version = app.getVersion()
    if (config.options.sendErrorReports && process.env.NODE_ENV !== 'development') {
        Sentry.init({
            dsn: process.env.VUE_APP_SENTRY,
            environment: config.build ? config.build.type : 'DEV',
            release: config.build && config.build.type === EBuild.REL ? config.version : 'dev',
        })
    }

    createWindow()
    interactInit()
    automateInit()
    upgradeInit()
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
