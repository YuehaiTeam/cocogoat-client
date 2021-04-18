import { reactive } from 'vue'

export const bus = reactive({
    runtimeDebug: false,
    ready: false,
    auto: false,
})
// @ts-ignore
window.bus = bus
