import path from 'node:path'

import tsParser from '@typescript-eslint/parser'

import vue from 'eslint-plugin-vue'
import vueCss from 'eslint-plugin-vue-scoped-css'
import vueAccess from 'eslint-plugin-vuejs-accessibility'
import vueParser from 'vue-eslint-parser'

import { baseArray } from './base.js'
import { webConfig } from './browser.js'

export const vueConfig = {
    ...webConfig,
    files: [...webConfig.files, '**/*.vue'],
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
            parser: tsParser,
            project: [
                path.resolve(process.cwd(), 'tsconfig.json'),
                path.resolve(process.cwd(), 'tsconfig.app.json'),
                'node_modules/@vue/tsconfig/tsconfig.dom.json'
            ],
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

export default [...baseArray, vueConfig]
