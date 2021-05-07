import { reactive } from 'vue'

export const bus = reactive({
    runtimeDebug: false,
    dataDir: '',
    x: 0,
    y: 0,
    zoom: 0,
})
// @ts-ignore
window.bus = bus
