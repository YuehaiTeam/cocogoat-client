import { createApp } from 'vue'
import App from './App.vue'
import { getConfig } from './ipc'
import { initSentry } from '@/plugins/sentry'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { bus } from './bus'
document.title = '地图 - 椰羊'
async function main() {
    const config = await getConfig()
    bus.dataDir = config.dataDir
    const app = createApp(App)
    initSentry(config, app)
    app.use(ElementPlus).mount('#app')
}
main()
