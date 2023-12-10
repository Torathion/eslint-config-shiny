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

import baseConfig, { webConfig } from './browser.js'

baseConfig.pop()
baseConfig.push(
    {
        ...webConfig,
        ...reactRecommended,
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        languageOptions: {
            ...webConfig.languageOptions,
            ...reactRecommended.languageOptions,
            parserOptions: {
                ...webConfig.languageOptions.parserOptions,
                jsx: true
            }
        },
        plugins: {
            ...webConfig.plugins,
            'jsx-a11y': jsx,
            react,
            'react-form-fields': reactFormFields,
            'react-hook-form': reactHookForm,
            'react-hooks': reactHooks,
            'react-perf': reactPerf,
            'react-prefer-function-component': reactPreferFC,
            'react-redux': reactRedux,
            'validate-jsx-nesting': validJsxNesting
        },
        rules: {
            ...webConfig.rules,
            ...jsx.configs.recommended.rules,
            ...shopify.configs.react.rules,
            ...reactFormFields.configs.recommended.rules,
            ...reactHookForm.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            ...reactPerf.configs.recommended.rules,
            ...reactPreferFC.configs.recommended.rules,
            ...reactRedux.configs.recommended.rules,
            ...sdl.configs.react.rules,
            'validate-jsx-nesting/no-invalid-jsx-nesting': 2
        }
    },
    { files: ['src/**/*.{mjsx,jsx,ts,tsx}'], ...react.configs['recommended-type-checked'] }
)

export default baseConfig
