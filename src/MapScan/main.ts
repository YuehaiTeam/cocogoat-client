import { createApp } from 'vue'
import App from './App.vue'
import { getConfig } from './ipc'
import { initSentry } from '@/plugins/sentry'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
document.title = '地图同步 - 椰羊'
async function main() {
    const config = await getConfig()
    const app = createApp(App)
    initSentry(config, app)
    app.use(ElementPlus).mount('#app')
}
main()
