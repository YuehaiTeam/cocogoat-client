import os from 'os'
import path from 'path'
import fsex from 'fs-extra'
import { app, ipcMain } from 'electron'
import { spawn } from 'child_process'
import { config } from '@/typings/config'
import { createHash } from 'crypto'
export function upgradeInit() {
    ipcMain.on('doUpgrade', async (event, { url, patch }: { url: string; patch: boolean }) => {
        const cocomilkSrc = path.join(config.dataDir, 'cocomilk.exe')
        const cocomilkDir = path.join(os.tmpdir(), 'cocogoat', 'ascension')
        const cocomilkDst = path.join(os.tmpdir(), 'cocogoat', 'ascension', 'cocomilk.exe')
        await fsex.ensureDir(cocomilkDir)
        await fsex.copyFile(cocomilkSrc, cocomilkDst)
        const subprocess = spawn(
            cocomilkDst,
            [`--app=${process.execPath}`, `--url=${url}`, `--patch=${patch ? 'true' : 'false'}`],
            {
                detached: true,
                stdio: 'ignore',
            },
        )
        subprocess.unref()
        setTimeout(() => {
            app.exit()
        }, 500)
    })
}
ipcMain.on('getApphash', (event, { id }) => {
    const stream = fsex.createReadStream(process.execPath)
    const md5sum = createHash('md5')
    stream.on('data', function (chunk) {
        md5sum.update(chunk)
    })
    stream.on('end', function () {
        const md5 = md5sum.digest('hex').toLowerCase()
        event.reply(`getApphash-${id}`, md5)
    })
})
