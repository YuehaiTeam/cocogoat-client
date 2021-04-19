import path from 'path'
import fsex from 'fs-extra'
import { config } from '@/typings/config'
export function saveOptions() {
    return fsex.writeJSON(path.join(config.configDir, 'options.json'), config.options)
}
