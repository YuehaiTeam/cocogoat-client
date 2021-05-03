import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import { router } from './router'
import { loadData, bus } from './bus'
import { initSentry } from '@/plugins/sentry'
import i18n, { __ } from '@/i18n'
async function main() {
    await loadData()
    const app = createApp(App)
    initSentry(bus.config, app)
    app.use(i18n, bus.config.options.lang, (newLang: string) => {
        bus.config.options.lang = newLang
    })
    app.use(router).use(ElementPlus)
    app.mount('#app')
    document.title = __('椰羊cocogoat')
}
main()
