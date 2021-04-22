import path from 'path'
import fsex from 'fs-extra'
import { Artifact } from '@/typings/Artifact'
import { defaultConfig, EBuild, IConfig } from '@/typings/config'
import { reactive, watch } from 'vue'
import { getConfig, readArtifacts } from './ipc'
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

// for deduplication
const artifactsHashes = new Set<string>()
function calculateArtifactHash(artifact: Artifact): string {
    const prefix = `${artifact.name}-${artifact.level}-${artifact.main.name}-${artifact.main.value}-${artifact.stars}`
    const subs = artifact.sub.map((s) => `${s.name}-${s.value}`)
    return [prefix, ...subs].join('_')
}

export const bus = reactive(<IBusData>{
    config: defaultConfig(),
    artifacts: [],
    hasUpgrade: false,
})
export async function loadData() {
    bus.config = await getConfig()
    try {
        bus.artifacts = []
        const artifacts = await readArtifacts()
        for (const artifact of artifacts) {
            const hash = calculateArtifactHash(artifact)
            if (!artifactsHashes.has(hash)) {
                artifactsHashes.add(hash)
            }
            bus.artifacts.push(artifact)
        }
    } catch (e) {
        bus.artifacts = []
    }
    ipcRenderer.on('artifactPush', (event, artifact: Artifact) => {
        artifactPush(artifact)
    })

    ipcRenderer.on('artifactDelete', (event, { id }: { id: number }) => {
        artifactDelete(id)
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
            let buildType = ''
            if (bus.config.build?.type === EBuild.DEV) {
                buildType = `.${bus.config.build?.timestamp}dev`
            } else if (bus.config.build?.type === EBuild.TES) {
                buildType = `.${bus.config.build?.timestamp}beta`
            }
            const localVersion = bus.config.version + buildType
            const release = await latestRelease(localVersion, 'auto')
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

                    const oldHash = calculateArtifactHash(bus.artifacts[i])
                    artifactsHashes.delete(oldHash)
                    const newHash = calculateArtifactHash(artifact)
                    // if (!bus.config.options.artifacts.keepSameArtifacts && artifactsHashes.has(newHash)) {
                    //     // 改成和某个已有的圣遗物一样了。怎么办？去重模式下直接去掉
                    // } else {
                    bus.artifacts[i] = artifact
                    artifactsHashes.add(newHash)
                    // }
                    console.log('EDIT', artifact)
                    break
                }
            }
        }
    }
    if (!isModify) {
        const hash = calculateArtifactHash(artifact)
        if (bus.config.options.artifacts.keepSameArtifacts || !artifactsHashes.has(hash)) {
            bus.artifacts.push(artifact)
            artifactsHashes.add(hash)
        }
        console.log('PUSH', artifact)
    }
}
export function artifactDelete(id: number) {
    bus.artifacts = bus.artifacts.filter((e) => {
        const preserve = e.id !== id
        if (!preserve) {
            artifactsHashes.delete(calculateArtifactHash(e))
        }
        return preserve
    })
}
export function artifactClear() {
    bus.artifacts = []
    artifactsHashes.clear()
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
