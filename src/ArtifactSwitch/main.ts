import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import { bus } from './bus'
import { getConfig } from './ipc'
import { initSentry } from '@/plugins/sentry'
document.title = '圣遗物自动切换 - 椰羊'
async function main() {
    const config = await getConfig()
    bus.options = config.options
    const app = createApp(App)
    initSentry(config, app)
    app.use(ElementPlus).mount('#app')
}
main()
