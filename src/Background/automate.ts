import { ipcMain } from 'electron'
// @ts-ignore
import ffi from 'ffi-napi'
const user32 = ffi.Library('user32', {
    mouse_event: ['void', ['int', 'int', 'int', 'int', 'int']],
})
const MOUSEEVENTF_WHEEL = 0x0800
const WHEEL_DELTA = 120
export function automateInit() {
    ipcMain.on('scrollTick', (event, up = false) => {
        user32.mouse_event(MOUSEEVENTF_WHEEL, 0, 0, up ? WHEEL_DELTA : -WHEEL_DELTA, 0)
    })
}
