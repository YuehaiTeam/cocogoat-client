import { ipcMain } from 'electron'
import ffi from 'ffi-napi'
import ref from 'ref-napi'
import { Key as RegKey, windef } from '@/plugins/registry-napi'
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
    ipcMain.on('checkVCRedistInstalled', (event, { id }) => {
        try {
            const vcKey = new RegKey(
                windef.HKEY.HKEY_LOCAL_MACHINE,
                'SOFTWARE\\Microsoft\\VisualStudio\\14.0\\VC\\Runtimes\\x64',
                windef.KEY_ACCESS.KEY_READ,
            )
            vcKey.close()
            event.reply(`checkVCRedistInstalled-${id}`, true)
        } catch (e) {
            event.reply(`checkVCRedistInstalled-${id}`, false)
            console.log('Find VCRedist Error', e)
        }
    })
    ipcMain.on('checkViGEmInstalled', (event, { id }) => {
        try {
            const vcKey = new RegKey(
                windef.HKEY.HKEY_LOCAL_MACHINE,
                'SOFTWARE\\Nefarius Software Solutions e.U.\\ViGEm Bus Driver',
                windef.KEY_ACCESS.KEY_READ,
            )
            vcKey.close()
            console.log('ViGEm Found')
            event.reply(`checkViGEmInstalled-${id}`, true)
        } catch (e) {
            event.reply(`checkViGEmInstalled-${id}`, false)
            console.log('ViGEm Not Found', e)
        }
    })
}
