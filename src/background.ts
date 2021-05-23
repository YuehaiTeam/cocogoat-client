import path from 'path'
import dayjs from 'dayjs'
import fsex from 'fs-extra'
import { merge } from 'lodash'
import { app, protocol } from 'electron'
import * as Sentry from '@sentry/electron'
import { interactInit } from './Background/interact'
import { createWindow } from './Background/windows'
import { config, EBuild } from './typings/config'
import { automateInit } from './Background/automate'
import { upgradeInit } from './Background/upgrade'
import { systemCheckInit } from './Background/Utils/SystemCheck'
import { logHook } from './Background/Utils/LogHook'

const isDevelopment = process.env.NODE_ENV !== 'production'
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true } },
])
app.on('window-all-closed', () => {
    app.quit()
})
app.on('ready', async () => {
    const currentPath = path.dirname(app.getPath('exe'))
    const appdataPath = app.getPath('userData')
    config.version = app.getVersion()
    try {
        await fsex.access(path.join(currentPath, 'cocogoat'))
        config.configDir = path.join(currentPath, 'cocogoat')
    } catch (e) {
        config.configDir = path.join(appdataPath, 'config')
        await fsex.ensureDir(config.configDir)
    }
    logHook(path.join(config.configDir, 'cocogoat.log'))
    console.log(`cocogoat v${config.version}`)
    console.log('confd = ' + config.configDir)
    try {
        config.options = merge(config.options, await fsex.readJSON(path.join(config.configDir, 'options.json')))
    } catch (e) {
        await fsex.writeJSON(path.join(config.configDir, 'options.json'), config.options)
    }
    try {
        config.dataDir = path.join(path.dirname(app.getAppPath()), 'data')
        config.build = await fsex.readJSON(path.join(config.dataDir, 'build.json'))
    } catch (e) {
        config.build = { type: EBuild.DEV, timestamp: Date.now() }
    }
    if (config.build) {
        console.log(`build = ${config.build.type}${dayjs(config.build.timestamp).format('YYMMDDHHmm')}`)
    }
    const pathEnv =
        `${config.dataDir};${path.join(config.dataDir, 'paddleocr')};${path.join(config.dataDir, 'opencv')};` +
        `${process.env.path ? `${process.env.path};` : ''}` +
        `${process.env.Path ? `${process.env.Path};` : ''}` +
        `${process.env.PATH ? `${process.env.PATH};` : ''}`
    for (const p of ['path', 'PATH', 'Path']) {
        process.env[p] = pathEnv
    }
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
    systemCheckInit()
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
