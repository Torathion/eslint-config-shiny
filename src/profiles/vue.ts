import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueCss from 'eslint-plugin-vue-scoped-css'
import vueAccess from 'eslint-plugin-vuejs-accessibility'
import processorVueBlocks from 'eslint-processor-vue-blocks'
import vueParser from 'vue-eslint-parser'

import { ban, replace } from '../tasks'
import { GeneralBanList, StyleVueReplaceList } from '../lists'
import type { PartialProfileConfig } from '../types/interfaces'

export const config: PartialProfileConfig = {
    extends: ['web'],
    files: ['**/*.vue'],
    languageOptions: {
        parser: vueParser,
        parserOptions: {
            ecmaFeatures: {
                jsx: true
            },
            extraFileExtensions: ['.vue'],
            parser: tsParser,
            project: ['node_modules/@vue/tsconfig/tsconfig.dom.json'],
            vueFeatures: {
                filter: true,
                interpolationAsNonHTML: true,
                styleCSSVariableInjection: true
            }
        }
    },
    name: 'vue',
    plugins: {
        vue,
        'vue-scoped-css': vueCss,
        'vuejs-accessibility': vueAccess
    },
    processor: [
        vue.processors['.vue'],
        processorVueBlocks({
            blocks: {
                customBlocks: true,
                script: false,
                styles: true,
                template: false
            }
        })
    ],
    rules: [
        vue.configs['vue3-recommended'],
        vueCss.configs['vue3-recommended'],
        ban(GeneralBanList, ['vue']),
        replace(StyleVueReplaceList, ['@stylistic/ts'], ['vue'])
    ]
}
