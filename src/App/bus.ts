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
const artifactsHashes = new Map<string, number>()
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
                artifactsHashes.set(hash, artifact.id)
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
    ipcRenderer.on('syncArtifact', (event, { id, artifact }: { id: number; artifact: Artifact }) => {
        const hash = calculateArtifactHash(artifact)
        const artifactId = artifactsHashes.get(hash)
        for (const artifact of bus.artifacts)
            if (artifactId === artifact.id) {
                ipcRenderer.sendTo(event.senderId, `syncArtifact-${id}`, JSON.parse(JSON.stringify(artifact)))
                return
            }
        ipcRenderer.sendTo(event.senderId, `syncArtifact-${id}`, null)
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
                    artifact.lock = bus.artifacts[i].lock
                    bus.artifacts[i] = artifact
                    artifactsHashes.set(newHash, artifact.id)
                    // }
                    console.log('EDIT', artifact)
                    break
                }
            }
        }
    }
    if (!isModify) {
        const hash = calculateArtifactHash(artifact)
        let upgrade = false
        if (bus.config.options.artifacts.upgradeArtifacts) {
            for (const oldArtifact of bus.artifacts) {
                let same = true
                if (
                    oldArtifact.main.name !== artifact.main.name ||
                    Number(oldArtifact.main.value.replace('%', '')) > Number(artifact.main.value.replace('%', '')) ||
                    oldArtifact.stars !== artifact.stars ||
                    oldArtifact.name !== artifact.name
                ) {
                    same = false
                    continue
                }
                const newSubs: Record<string, string> = {}
                for (const newSub of artifact.sub) {
                    newSubs[newSub.name] = newSub.value
                }
                for (const oldSub of oldArtifact.sub) {
                    if (
                        newSubs[oldSub.name] === undefined ||
                        Number(newSubs[oldSub.name].replace('%', '')) < Number(oldSub.value.replace('%', ''))
                    ) {
                        same = false
                        break
                    }
                }
                if (same) {
                    artifactsHashes.delete(calculateArtifactHash(oldArtifact))
                    bus.artifacts.splice(bus.artifacts.indexOf(oldArtifact), 1)
                    artifact.id = oldArtifact.id
                    artifact.lock = oldArtifact.lock
                    artifactsHashes.set(hash, artifact.id)
                    bus.artifacts.push(artifact)
                    upgrade = true
                    break
                }
            }
        }
        if ((bus.config.options.artifacts.keepSameArtifacts || !artifactsHashes.has(hash)) && !upgrade) {
            bus.artifacts.push(artifact)
            artifactsHashes.set(hash, artifact.id)
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
