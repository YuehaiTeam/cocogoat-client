import { reactive } from 'vue'

export const bus = reactive({
    runtimeDebug: false,
    x: 0,
    y: 0,
    zoom: 0,
})
// @ts-ignore
window.bus = bus
