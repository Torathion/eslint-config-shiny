import sdl from '@microsoft/eslint-plugin-sdl'
import shopify from '@shopify/eslint-plugin'
import jsx from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactFormFields from 'eslint-plugin-react-form-fields'
import reactHookForm from 'eslint-plugin-react-hook-form'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPerf from 'eslint-plugin-react-perf'
import reactPreferFC from 'eslint-plugin-react-prefer-function-component'
import reactRedux from 'eslint-plugin-react-redux'
import validJsxNesting from 'eslint-plugin-validate-jsx-nesting'

import reactRecommended from 'eslint-plugin-react/configs/recommended.js'

import { baseArray } from './base.js'
import { webConfig } from './browser.js'

import { JsxStyleReplaceList, apply, merge, mergeRules, replace } from '../dist/index.js'

const appliedConfig = apply({
    'jsx-a11y': jsx,
    react,
    'react-form-fields': reactFormFields,
    'react-hook-form': reactHookForm,
    'react-hooks': reactHooks,
    'react-perf': reactPerf,
    'react-prefer-function-component': reactPreferFC,
    'react-redux': reactRedux
})

const reactConfig = [
    {
        ...webConfig,
        ...reactRecommended,
        languageOptions: {
            ...webConfig.languageOptions,
            ...reactRecommended.languageOptions,
            parserOptions: {
                ...webConfig.languageOptions.parserOptions,
                jsx: true
            }
        },
        plugins: merge(webConfig.plugins, appliedConfig.plugins, { 'validate-jsx-nesting': validJsxNesting }),
        rules: {
            ...mergeRules(
                webConfig,
                appliedConfig.plugins,
                shopify.configs.react,
                sdl.configs.react,
                replace(JsxStyleReplaceList, ['react'], ['@stylistic/jsx'])
            ),
            'validate-jsx-nesting/no-invalid-jsx-nesting': 2
        }
    },
    { files: ['src/**/*.{mjsx,jsx,ts,tsx}'], ...react.configs['recommended-type-checked'] }
]

export default [...baseArray, ...reactConfig]
