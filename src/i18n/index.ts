import { App, reactive, watch } from 'vue'
import createi18n from './gettext'
import { availableLocales } from './availableLocales'

const i18n = createi18n()
for (const i in availableLocales) {
    if ({}.hasOwnProperty.call(availableLocales, i)) {
        i18n.loadJSON(availableLocales[i])
    }
}

export default {
    install: (app: App, defaultLang?: string, setLang?: (lang: string) => any) => {
        let [lang] = navigator.language.split('-')
        lang = defaultLang || lang
        i18n.setLocale(availableLocales[lang] ? lang : 'zh')
        app.config.globalProperties.$availableLocales = availableLocales
        app.config.globalProperties.$i18n = i18n
        const langOptions = reactive({
            lang: i18n.getLocale(),
        })
        watch(
            () => langOptions,
            (newVal) => {
                setLang && setLang(newVal.lang)
            },
            {
                deep: true,
            },
        )
        app.config.globalProperties.$lang = langOptions

        app.config.globalProperties.__ = (...args: any[]) => {
            i18n.setLocale(availableLocales[langOptions.lang] ? langOptions.lang : 'zh')
            return i18n.gettext(...args)
        }
        app.config.globalProperties.___ = (...args: any[]) => {
            i18n.setLocale(availableLocales[langOptions.lang] ? langOptions.lang : 'zh')
            return i18n.ngettext(...args)
        }
    },
}

export function __(...args: any[]) {
    return i18n.gettext(...args)
}
