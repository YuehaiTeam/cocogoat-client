import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import { router } from './router'
import { loadData } from './bus'
async function main() {
    await loadData()
    const app = createApp(App)
    app.use(router).use(ElementPlus)
    app.mount('#app')
}
main()
