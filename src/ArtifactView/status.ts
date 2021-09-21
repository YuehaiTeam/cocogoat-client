import { Artifact } from '@/typings/Artifact'
import { IOptions } from '@/typings/config'
import { reactive } from 'vue'
export enum STATUS {
    'INTRO',
    'LOADING',
    'SUCCESS',
    'ERROR',
    'MODIFIED',
    'DELETED',
}
interface WrongReportData {
    ocrResult: Record<string, any>
    artifact: Artifact
    screenshot: string
    splitImages: Record<string, string>
    message: string
    screen: any
    devicePixelRatio: typeof window.devicePixelRatio
    windowWidth: number
    windowHeight: number
    version: string
    build: any
}
interface statusType {
    version: string
    build: any
    options: IOptions | null
    status: STATUS
    artifact: Artifact
    artifactBackup: Artifact | null
    potentialErrors: string[]
    runtimeDebug: boolean
    auto: boolean
    hotkey: number
    wrongReportData: WrongReportData | null
}
export const status = reactive(<statusType>{
    version: '',
    build: {},
    options: null,
    status: STATUS.INTRO,
    runtimeDebug: false,
    auto: false,
    hotkey: 41,
    potentialErrors: [],
    artifactBackup: null,
    artifact: {
        id: 0,
        name: '魔女的心之火',
        stars: 5,
        lock: false,
        level: 20,
        user: '诺艾尔',
        main: {
            name: '防御力',
            value: '20%',
        },
        sub: [
            {
                name: '防御力',
                value: '666',
            },
            {
                name: '生命值',
                value: '1919',
            },
            {
                name: '元素充能效率',
                value: '8.10%',
            },
            {
                name: '防御力',
                value: '5.2%',
            },
        ],
    },
    wrongReportData: null,
})
