import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import i18n, { __ } from '@/i18n'
import { bus } from './bus'
import { getConfig } from './ipc'
import { initSentry } from '@/plugins/sentry'
async function main() {
    const config = await getConfig()
    bus.options = config.options
    const app = createApp(App)
    initSentry(config, app)
    app.use(i18n, config.options.lang)
    app.use(ElementPlus).mount('#app')
    document.title = __('圣遗物切换器 - 椰羊')
}
main()
