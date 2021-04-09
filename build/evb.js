/*
 * Packager script using enigma virtual box and gzip
 */
const path = require('path')
const dayjs = require('dayjs')
const fsex = require('fs-extra')
const { promisify } = require('util')
const { pipeline } = require('stream')
const { createGzip } = require('zlib')
const evb = require('enigmavirtualbox')
const { spawn } = require('child_process')
const generateEvb = require('generate-evb')
const pipe = promisify(pipeline)

exports.default = async function (context) {
    const baseDir = context.outDir
    const projDir = path.dirname(baseDir)
    const distDir = path.join(baseDir, 'win-unpacked')
    const ouptDir = path.join(projDir, 'dist')
    const packageJSON = await fsex.readJSON(path.join(projDir, 'package.json'))
    const build = dayjs().format('YYYYMMDDHHmm')
    await fsex.rename(path.join(distDir, '椰羊cocogoat.exe'), path.join(distDir, 'cocogoat.exe'))
    await fsex.ensureDir(ouptDir)
    console.log('preparing evb file')
    const evbFile = path.join(baseDir, 'build.evb')
    const ouptFile = path.join(ouptDir, `cocogoat-v${packageJSON.version}-win64-b${build}.exe`)
    generateEvb(evbFile, path.join(distDir, 'cocogoat.exe'), ouptFile, path.join(baseDir, 'win-unpacked'), {
        filter(fullPath, name) {
            if (name === 'cocogoat.exe') return false
            if (name.endsWith('.map')) return false
            return true
        },
        shareVirtualSystem: true,
    })
    console.log('start packaging ' + evbFile)
    const evbexe = evb.path('cli')
    const child = spawn(evbexe, [evbFile])
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    await new Promise((resolve) => {
        child.on('exit', resolve)
    })
    console.log('compressing as gzip')
    const gzip = createGzip()
    const source = fsex.createReadStream(ouptFile)
    const destination = fsex.createWriteStream(`${ouptFile}.gz`)
    await pipe(source, gzip, destination)
    console.log('evb done, output file is', `${ouptFile}.gz`)
}
