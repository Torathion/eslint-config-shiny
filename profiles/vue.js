import tsParser from '@typescript-eslint/parser'
import espree from 'espree'

import vue from 'eslint-plugin-vue'
import vueCss from 'eslint-plugin-vue-scoped-css'
import vueAccess from 'eslint-plugin-vuejs-accessibility'
import vueParser from 'vue-eslint-parser'

import baseConfig, { webConfig } from './browser.js'

export const vueConfig = {
    ...webConfig,
    files: [...webConfig.files, '*.vue'],
    plugins: {
        ...webConfig.plugins,
        'vuejs-accessibility': vueAccess,
        'vue-scoped-css': vueCss,
        vue
    },
    languageOptions: {
        ...webConfig.languageOptions,
        parser: vueParser,
        parserOptions: {
            ...webConfig.languageOptions.parserOptions,
            js: espree,
            jsx: espree,
            cjs: espree,
            mjs: espree,
            ts: tsParser,
            tsx: tsParser,
            cts: tsParser,
            mts: tsParser,
            extraFileExtensions: ['.vue'],
            vueFeatures: {
                filter: true,
                interpolationAsNonHTML: true,
                styleCSSVariableInjection: true
            },
            ecmaFeatures: {
                jsx: true
            }
        }
    },
    rules: {
        ...webConfig.rules,
        ...vue.configs['vue3-recommended'].rules,
        ...vueAccess.configs.recommended.rules,
        ...vueCss.configs['vue3-recommended'].rules
    }
}

baseConfig.pop()
baseConfig.push(vueConfig)

export default baseConfig
