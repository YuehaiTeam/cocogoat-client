module.exports = {
    root: true,

    env: {
        node: true,
    },

    rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'vue/no-duplicate-attributes': [
            'error',
            {
                allowCoexistClass: true,
                allowCoexistStyle: true,
            },
        ],
        'max-params': ['warn', 5],
    },

    extends: ['alloy', 'alloy/vue', 'plugin:vue/vue3-essential', '@vue/prettier', '@vue/typescript'],

    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
}
