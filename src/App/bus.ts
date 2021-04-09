import path from 'path'
import fsex from 'fs-extra'
import { Artifact } from '@/typings/Artifact'
import { IConfig } from '@/typings/config'
import { reactive, watch } from 'vue'
import { getConfig } from './ipc'
import { ipcRenderer } from 'electron'
let lastConfigWrite: Promise<any> | null = null
let configRead = false
interface IBusData {
    config: IConfig
    artifacts: Artifact[]
}
export const bus = reactive(<IBusData>{
    config: {
        configDir: '',
        options: {
            firstRun: true,
            sendErrorReports: true,
            sendWrongOCRReports: false,
        },
    },
    artifacts: [],
})
export async function loadData() {
    bus.config = await getConfig()
    try {
        bus.artifacts = await fsex.readJSON(path.join(bus.config.configDir, 'artifacts.json'))
    } catch (e) {
        bus.artifacts = []
    }
    ipcRenderer.on('artifactPush', (event, artifact: Artifact) => {
        let isModify = false
        for (const i in bus.artifacts) {
            if ({}.hasOwnProperty.call(bus.artifacts, i)) {
                if (bus.artifacts[i].id === artifact.id) {
                    // ID重复，是修改。
                    isModify = true
                    bus.artifacts[i] = artifact
                    console.log('got edit from artifactView', artifact)
                    break
                }
            }
        }
        if (!isModify) {
            bus.artifacts.push(artifact)
            console.log('got new from artifactView', artifact)
        }
    })

    ipcRenderer.on('artifactDelete', (event, { id }: { id: number }) => {
        bus.artifacts = bus.artifacts.filter((e) => {
            return e.id !== id
        })
    })
}
watch(
    () => bus.artifacts,
    async (newValue) => {
        if (!configRead) {
            configRead = true
            return
        }
        await lastConfigWrite
        lastConfigWrite = fsex.writeJSON(path.join(bus.config.configDir, 'artifacts.json'), newValue)
        await lastConfigWrite
    },
    {
        deep: true,
    },
)
// @ts-ignore
window.bus = bus
