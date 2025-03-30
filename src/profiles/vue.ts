import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueCss from 'eslint-plugin-vue-scoped-css'
import vueAccess from 'eslint-plugin-vuejs-accessibility'
import processorVueBlocks from 'eslint-processor-vue-blocks'
import vueParser from 'vue-eslint-parser'

import type { PartialProfileConfig, ProjectMetadata } from '../types/interfaces'

export default function vueConfig(_metadata: ProjectMetadata): PartialProfileConfig {
    return {
        extends: ['web'],
        files: ['**/*.vue'],
        languageOptions: {
            globals: {
                computed: 'readonly',
                defineEmits: 'readonly',
                defineExpose: 'readonly',
                defineProps: 'readonly',
                onMounted: 'readonly',
                onUnmounted: 'readonly',
                reactive: 'readonly',
                ref: 'readonly',
                shallowReactive: 'readonly',
                shallowRef: 'readonly',
                toRef: 'readonly',
                toRefs: 'readonly',
                watch: 'readonly',
                watchEffect: 'readonly'
            },
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
            vue.configs['vue3-strongly-recommended'],
            vue.configs['vue3-essential'],
            vueCss.configs['vue3-recommended'],
            vueAccess.configs['flat/recommended'][1],
            {
                'vue/html-indent': 0,
                'vue/html-self-closing': 0,
                'vue/max-attributes-per-line': [
                    2,
                    {
                        multiline: {
                            max: 1
                        },
                        singleline: {
                            max: 3
                        }
                    }
                ],
                'vue/multi-word-component-names': 0,
                'vue/singleline-html-element-content-newline': 0
            }
        ],
        settings: {
            'import-resolver': {
                'eslint-import-resolver-custom-alias': {
                    alias: {
                        '@': './src'
                    },
                    extensions: ['.vue', '.json', '.ts', '.js']
                }
            }
        }
    }
}
