import { resolve } from 'node:path'

import tsParser from '@typescript-eslint/parser'

import vue from 'eslint-plugin-vue'
import vueCss from 'eslint-plugin-vue-scoped-css'
import vueAccess from 'eslint-plugin-vuejs-accessibility'
import processorVueBlocks from 'eslint-processor-vue-blocks'
import vueParser from 'vue-eslint-parser'
import { baseArray } from './base.js'
import { webConfig } from './browser.js'

import { GeneralBanList, StyleVueReplaceList, ban, mergeProcessors, mergeRules, replace, cwd } from '../dist/index.js'

export const vueConfig = {
    ...webConfig,
    files: [...webConfig.files, '**/*.vue'],
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
            ...webConfig.languageOptions.parserOptions,
            parser: tsParser,
            project: [
                webConfig.languageOptions.parserOptions.project,
                resolve(cwd, 'tsconfig.app.json'),
                resolve(cwd, 'tsconfig.node.json'),
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
