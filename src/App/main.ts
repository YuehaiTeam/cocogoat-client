import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import { router } from './router'
import { loadData, bus } from './bus'
import { initSentry } from '@/plugins/sentry'
import i18n from '@/i18n'
async function main() {
    await loadData()
    const app = createApp(App)
    initSentry(bus.config, app)
    app.use(i18n).use(router).use(ElementPlus)
    const root = app.mount('#app')
    // @ts-ignore
    document.title = root.__('椰羊cocogoat')
}
main()
