import { ipcMain } from 'electron'
import ffi from 'ffi-napi'
import ref from 'ref-napi'
const dwmapi = ffi.Library('dwmapi', {
    DwmIsCompositionEnabled: [ffi.types.ulong, [ref.refType(ref.types.int)]],
})
export function systemCheckInit() {
    ipcMain.on('checkDwmIsCompositionEnabled', (event, { id }) => {
        const pfEnabled = ref.alloc(ref.types.int)
        const error = dwmapi.DwmIsCompositionEnabled(pfEnabled)
        const enabled = ref.deref(pfEnabled)
        event.reply(`checkDwmIsCompositionEnabled-${id}`, {
            error,
            enabled: enabled ? true : false,
        })
    })
}
