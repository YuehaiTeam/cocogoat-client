export interface IArtifactOptions {
    preserveSwitcher: boolean
    keepSameArtifacts: boolean
    autoSwitchDelay: number
}
export interface IOptions {
    firstRun: boolean
    sendErrorReports: boolean
    sendWrongOCRReports: boolean
    artifacts: IArtifactOptions
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
export const config = <IConfig>{
    version: '',
    build: null,
    configDir: '',
    dataDir: '',
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
}
