import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import { bus } from './bus'
import { getConfig } from './ipc'
document.title = '圣遗物自动切换 - 椰羊'
async function main() {
    bus.options = (await getConfig()).options
    createApp(App).use(ElementPlus).mount('#app')
}
main()
