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
}
