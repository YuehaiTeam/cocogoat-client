export interface IOptions {
    firstRun: boolean
    sendErrorReports: boolean
    sendWrongOCRReports: boolean
}
export interface IConfig {
    configDir: string
    options: IOptions | null
}
export const config = <IConfig>{
    configDir: '',
    options: {
        firstRun: false,
        sendErrorReports: true,
        sendWrongOCRReports: false,
    },
}
