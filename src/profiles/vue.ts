import tsParser from '@typescript-eslint/parser'

import vue from 'eslint-plugin-vue'
import vueCss from 'eslint-plugin-vue-scoped-css'
import vueAccess from 'eslint-plugin-vuejs-accessibility'
import processorVueBlocks from 'eslint-processor-vue-blocks'
import vueParser from 'vue-eslint-parser'
import { baseArray } from './base'
import { webConfig } from './browser'
import { ban, mergeProcessors, mergeRules, replace } from '../tasks'
import mergeArr from '../utils/mergeArr'
import { GeneralBanList, StyleVueReplaceList } from '../lists'
import type { ProfileConfig } from '../types/interfaces'

export const vueConfig: ProfileConfig = {
    ...webConfig,
    files: [...webConfig.files!, '**/*.vue'],
    plugins: {
        ...webConfig.plugins,
        'vuejs-accessibility': vueAccess,
        'vue-scoped-css': vueCss,
        vue
    },
    processor: mergeProcessors([
        vue.processors['.vue'],
        processorVueBlocks({
            blocks: {
                styles: true,
                customBlocks: true,
                script: false,
                template: false
            }
        })
    ]),
    languageOptions: {
        ...webConfig.languageOptions,
        parser: vueParser,
        parserOptions: {
            ...webConfig.languageOptions!.parserOptions,
            parser: tsParser,
            project: mergeArr(webConfig.languageOptions!.parserOptions!.project, ['node_modules/@vue/tsconfig/tsconfig.dom.json']),
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
    rules: mergeRules(
        webConfig,
        vue.configs['vue3-recommended'],
        vueAccess.configs.recommended,
        vueCss.configs['vue3-recommended'],
        ban(GeneralBanList, ['vue']),
        replace(StyleVueReplaceList, ['@stylistic/ts'], ['vue'])
    )
}

export default [...baseArray, vueConfig]
