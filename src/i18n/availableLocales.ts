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
    },
    jp: {
        __name: '日本語',
        '': {
            language: 'jp',
            plurals: {
                text: 'nplurals = 1; plural = 0',
                func(n: number) {
                    return false
                },
            },
        },
        ...require('./locales/jp.json'),
    },
}
