import tsParser from '@typescript-eslint/parser'

import vue from 'eslint-plugin-vue'
import vueCss from 'eslint-plugin-vue-scoped-css'
import vueAccess from 'eslint-plugin-vuejs-accessibility'
import processorVueBlocks from 'eslint-processor-vue-blocks'
import vueParser from 'vue-eslint-parser'

import { ban, replace } from '../tasks'
import { GeneralBanList, StyleVueReplaceList } from '../lists'
import type { PartialProfileConfig } from '../types/interfaces'

export const vueConfig: PartialProfileConfig = {
    extends: ['web'],
    files: ['**/*.vue'],
    plugins: {
        'vuejs-accessibility': vueAccess,
        'vue-scoped-css': vueCss,
        vue
    },
    processor: [
        vue.processors['.vue'],
        processorVueBlocks({
            blocks: {
                styles: true,
                customBlocks: true,
                script: false,
                template: false
            }
        })
    ],
    languageOptions: {
        parser: vueParser,
        parserOptions: {
            parser: tsParser,
            project: ['node_modules/@vue/tsconfig/tsconfig.dom.json'],
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
    rules: [
        vue.configs['vue3-recommended'],
        vueCss.configs['vue3-recommended'],
        ban(GeneralBanList, ['vue']),
        replace(StyleVueReplaceList, ['@stylistic/ts'], ['vue'])
    ]
}

export default vueConfig
