import dayjs from 'dayjs'
import fsex from 'fs-extra'
import { inspect } from 'util'
import hookStd from 'hook-std'
import { isMainThread, workerData } from 'worker_threads'
export function logHook(output?: string) {
    if (isMainThread && output) {
        const logFile = fsex.createWriteStream(output)
        hookStd.stdout({ silent: false }, (data) => {
            logFile.write(data)
        })
    }
    const prefix = isMainThread ? '[MAIN]' : `[${workerData.name || workerData.worker || 'WORK'}]`
    // @ts-ignore
    console._log = console.log
    // @ts-ignore
    console._error = console.error
    console.log = (...args: any) => {
        let buffer = ''
        buffer += `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}][LOG]${prefix} `
        for (const i of args) {
            buffer += typeof i === 'string' ? i : inspect(i) + ' '
        }
        process.stdout.write(buffer + '\r\n')
    }
    console.error = (...args: any) => {
        let buffer = ''
        buffer += `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}][ERR]${prefix} `
        for (const i of args) {
            buffer += typeof i === 'string' ? i : inspect(i) + ' '
        }
        process.stdout.write(buffer + '\r\n')
    }
}
