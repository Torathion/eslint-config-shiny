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

import { mergeRules, replace } from '../tasks'
import { JsxStyleReplaceList } from '../lists'
import type { ProfileConfig } from '../types/interfaces'

const reactConfig: Partial<ProfileConfig>[] = [
    {
        extends: ['web'],
        apply: {
            'jsx-a11y': jsx,
            react,
            'react-form-fields': reactFormFields,
            'react-hook-form': reactHookForm,
            'react-hooks': reactHooks,
            'react-perf': reactPerf,
            'react-prefer-function-component': reactPreferFC,
            'react-redux': reactRedux
        },
        languageOptions: {
            parserOptions: {
                jsx: true
            }
        },
        plugins: { 'validate-jsx-nesting': validJsxNesting },
        rules: {
            ...mergeRules(shopify.configs.react, sdl.configs.react, replace(JsxStyleReplaceList, ['react'], ['@stylistic/jsx'])),
            'validate-jsx-nesting/no-invalid-jsx-nesting': 2
        }
    },
    { files: ['src/**/*.{mjsx,jsx,ts,tsx}'], ...react.configs['recommended-type-checked'] }
]

export default reactConfig
