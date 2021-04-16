import { App, reactive } from 'vue'
// @ts-ignore
import createi18n from './gettext'
import en from './locales/en/index'
const availableLocales: Record<string, any> = { en }

const i18n = createi18n()
for (const i in availableLocales) {
    if ({}.hasOwnProperty.call(availableLocales, i)) {
        i18n.loadJSON(availableLocales[i])
    }
}
let [lang] = navigator.language.split('-')
lang = localStorage.lang || lang
i18n.setLocale(availableLocales[lang] ? lang : 'zh')

export default {
    install: (app: App) => {
        app.config.globalProperties.$availableLocales = availableLocales
        app.config.globalProperties.$i18n = i18n
        const langOptions = reactive({
            lang: i18n.getLocale(),
        })
        app.config.globalProperties.$lang = langOptions

        app.config.globalProperties.__ = (...args: any[]) => {
            i18n.setLocale(availableLocales[langOptions.lang] ? langOptions.lang : 'zh')
            localStorage.lang = i18n.getLocale()
            return i18n.gettext(...args)
        }
        app.config.globalProperties.___ = (...args: any[]) => {
            i18n.setLocale(availableLocales[langOptions.lang] ? langOptions.lang : 'zh')
            localStorage.lang = i18n.getLocale()
            return i18n.ngettext(...args)
        }
    },
}

export function __(...args: any[]) {
    return i18n.gettext(...args)
}
