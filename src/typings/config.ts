export interface IArtifactOptions {
    preserveSwitcher: boolean
    keepSameArtifacts: boolean
    upgradeArtifacts: boolean
    autoSwitchDelay: number
    fastScroll: boolean
}
export interface IwindowStates {
    x?: number
    y?: number
    width: number
    height: number
}
export interface IwindowStates {
    x?: number
    y?: number
    width: number
    height: number
}
export interface IOptions {
    lang: string
    firstRun: boolean
    sendErrorReports: boolean
    sendWrongOCRReports: boolean
    artifacts: IArtifactOptions
    windowStates: Record<string, IwindowStates>
}
export enum EBuild {
    'DEV' = 'DEV',
    'REL' = 'REL',
    'TES' = 'TES',
}
export interface IBuildInfo {
    type: EBuild
    timestamp: number
}
export interface IConfig {
    version: string
    build: IBuildInfo | null
    configDir: string
    dataDir: string
    options: IOptions
}
export function defaultConfig(): IConfig {
    return {
        version: '',
        build: null,
        configDir: '',
        dataDir: '',
        options: {
            lang: '',
            firstRun: true,
            sendErrorReports: true,
            sendWrongOCRReports: true,
            artifacts: {
                preserveSwitcher: false,
                keepSameArtifacts: false,
                upgradeArtifacts: false,
                autoSwitchDelay: 0.5,
                fastScroll: true,
            },
            windowStates: {},
        },
    }
}
export const config = <IConfig>defaultConfig()
