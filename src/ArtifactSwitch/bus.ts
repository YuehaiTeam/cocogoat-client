import { IOptions } from '@/typings/config'
import { reactive } from 'vue'
export enum STATUS {
    'INTRO',
    'READY',
    'CAPTURE',
    'CLICK',
    'PAGING',
    'SUCCESS',
    'ERROR',
    'MODIFIED',
    'DELETED',
}
interface IArtifactSwitchBus {
    intro: boolean
    status: STATUS
    runtimeDebug: boolean
    auto: boolean
    hotkey: number
    blocks: any[]
    checkedCount: number
    currentCount: number
    totalCount: number
    isLastPage: boolean
    blockWidth: number
    options: IOptions | null
}
export const bus = reactive(<IArtifactSwitchBus>{
    intro: true,
    status: STATUS.READY,
    runtimeDebug: false,
    auto: false,
    hotkey: 41,
    blocks: [],
    checkedCount: 0,
    currentCount: 0,
    totalCount: 0,
    rows: 0,
    cols: 0,
    isLastPage: false,
    blockWidth: 0,
    options: null,
})
// @ts-ignore
window.bus = bus
