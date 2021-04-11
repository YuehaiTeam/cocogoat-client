import path from 'path'
import fsex from 'fs-extra'
import { Artifact } from '@/typings/Artifact'
import { EBuild, IConfig } from '@/typings/config'
import { reactive, watch } from 'vue'
import { getConfig } from './ipc'
import { ipcRenderer } from 'electron'
import { latestRelease } from '@/api/upgrade'
export { API_BASE } from '@/config'
import { version_compare } from '@/plugins/version_compare'

let lastConfigWrite: Promise<any> | null = null
let configRead = false
interface IBusData {
    config: IConfig
    artifacts: Artifact[]
    hasUpgrade: boolean
}
export const bus = reactive(<IBusData>{
    config: {
        version: '',
        build: null,
        dataDir: '',
        configDir: '',
        options: {
            firstRun: true,
            sendErrorReports: true,
            sendWrongOCRReports: false,
            artifacts: {
                preserveSwitcher: false,
                keepSameArtifacts: false,
                autoSwitchDelay: 0.5,
            },
        },
    },
    artifacts: [],
    hasUpgrade: false,
})
export async function loadData() {
    bus.config = await getConfig()
    try {
        bus.artifacts = await fsex.readJSON(path.join(bus.config.configDir, 'artifacts.json'))
    } catch (e) {
        bus.artifacts = []
    }
    ipcRenderer.on('artifactPush', (event, artifact: Artifact) => {
        artifactPush(artifact)
    })

    ipcRenderer.on('artifactDelete', (event, { id }: { id: number }) => {
        bus.artifacts = bus.artifacts.filter((e) => {
            return e.id !== id
        })
    })

    watch(
        () => bus.config.options,
        async (newValue) => {
            ipcRenderer.send('saveOptions', JSON.parse(JSON.stringify(newValue)))
        },
        {
            deep: true,
        },
    )
    ;(async function () {
        try {
            const release = await latestRelease()
            let buildType = ''
            if (bus.config.build?.type === EBuild.DEV) {
                buildType = 'dev'
            } else if (bus.config.build?.type === EBuild.TES) {
                buildType = 'beta'
            }
            const localVersion = bus.config.version + buildType
            const cmp = version_compare(localVersion, release.version)
            if (cmp && cmp < 0) {
                bus.hasUpgrade = true
            }
        } catch (e) {}
    })()
}
export function artifactPush(artifact: Artifact) {
    let isModify = false
    if (bus.artifacts.length > 0) {
        for (const i in bus.artifacts) {
            if ({}.hasOwnProperty.call(bus.artifacts, i)) {
                if (bus.artifacts[i].id === artifact.id) {
                    // ID重复，是修改。
                    isModify = true
                    bus.artifacts[i] = artifact
                    console.log('EDIT', artifact)
                    break
                }
            }
        }
    }
    if (!isModify) {
        bus.artifacts.push(artifact)
        console.log('PUSH', artifact)
    }
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
