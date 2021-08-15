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
    },
}
