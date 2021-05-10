/*
 * Replace files to build noavx versions
 */
const path = require('path')
const fsex = require('fs-extra')
const from = path.join(__dirname, 'noavx', 'paddle_inference.dll')
const to = path.join(
    __dirname,
    '..',
    'dist_electron',
    'win-unpacked',
    'resources',
    'data',
    'paddleocr',
    'paddle_inference.dll',
)
fsex.copySync(from, to, {
    overwrite: true,
})
console.log('replaced paddle_inference.dll with noavx version')
