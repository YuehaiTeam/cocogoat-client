export const availableLocales: Record<string, any> = {
    en: {
        __name: 'English',
        '': {
            language: 'en',
            plurals: {
                text: 'nplurals = 2; plural = (n > 1)',
                func(n: number) {
                    return n > 1
                },
            },
        },
        ...require('./locales/en.json'),
        ...require('./locales/en_artifacts.json').params,
        ...require('./locales/en_artifacts.json').names,
    },
    jp: {
        __name: '日本語',
        '': {
            language: 'jp',
            plurals: {
                text: 'nplurals = 1; plural = 0',
                func() {
                    return false
                },
            },
        },
        ...require('./locales/jp.json'),
        ...require('./locales/jp_artifacts.json').names,
        ...require('./locales/jp_artifacts.json').params,
    },
    pt: {
        __name: 'Portuguese',
        '': {
            language: 'pt',
            plurals: {
                text: 'nplurals = 2; plural = (n !== 1)',
                func(n: number) {
                    return n !== 1
                },
            },
        },
        ...require('./locales/pt.json'),
        ...require('./locales/pt_artifacts.json').names,
        ...require('./locales/pt_artifacts.json').params,
    },
    ru: {
        __name: 'Russian',
        '': {
            language: 'ru',
            plurals: {
                text: 'nplurals = 3; plural = (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2)',
                func(n: number) {
                    return n % 10 === 1 && n % 100 !== 11
                        ? 0
                        : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
                        ? 1
                        : 2
                },
            },
        },
        ...require('./locales/ru.json'),
        ...require('./locales/ru_artifacts.json').names,
        ...require('./locales/ru_artifacts.json').params,
    },
    kr: {
        __name: 'Korean',
        '': {
            language: 'kr',
            plurals: {
                text: 'nplurals = 1; plural = 0',
                func: function () {
                    return 0
                },
            },
        },
        ...require('./locales/kr.json'),
        ...require('./locales/kr_artifacts.json').names,
        ...require('./locales/kr_artifacts.json').params,
    },
    de: {
        __name: 'German',
        '': {
            language: 'de',
            plurals: {
                text: 'nplurals = 2; plural = (n !== 1)',
                func: function (n: number) {
                    return n !== 1
                },
            },
        },
        ...require('./locales/de.json'),
        ...require('./locales/de_artifacts.json').names,
        ...require('./locales/de_artifacts.json').params,
    },
}
