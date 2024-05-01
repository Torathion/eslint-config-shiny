import sdl from '@microsoft/eslint-plugin-sdl'
import react from 'eslint-plugin-react'
import reactFormFields from 'eslint-plugin-react-form-fields'
import reactHookForm from 'eslint-plugin-react-hook-form'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPerf from 'eslint-plugin-react-perf'
import reactPreferFC from 'eslint-plugin-react-prefer-function-component'
import reactRedux from 'eslint-plugin-react-redux'
import useMemo from '@arthurgeron/eslint-plugin-react-usememo'
import validJsxNesting from 'eslint-plugin-validate-jsx-nesting'
import esReact from '@eslint-react/eslint-plugin'
import stylisticJsx from '@stylistic/eslint-plugin-jsx'

import { replace } from '../tasks'
import type { PartialProfileConfig } from '../types/interfaces'

const JsxStyleReplaceList = [
    'jsx-closing-bracket-location',
    'jsx-closing-tag-location',
    'jsx-curly-brace-presence',
    'jsx-equals-spacing',
    'jsx-indent',
    'jsx-indent-props',
    'jsx-pascal-case',
    'jsx-props-no-multi-spaces',
    'jsx-self-closing-comp',
    'jsx-tag-spacing',
    'jsx-wrap-multilines'
]

// INFO: remove jsx-a11y until https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/pull/891 is passed

export const config: PartialProfileConfig = {
    apply: {
        react,
        'react-form-fields': reactFormFields,
        'react-hook-form': reactHookForm,
        'react-hooks': reactHooks,
        'react-perf': reactPerf,
        'react-prefer-function-component': reactPreferFC,
        'react-redux': reactRedux
    },
    extends: ['web'],
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true
            }
        }
    },
    name: 'react',
    plugins: { '@eslint-react': esReact, '@stylistic/jsx': stylisticJsx, 'use-memo': useMemo, 'validate-jsx-nesting': validJsxNesting },
    rules: [
        sdl.configs.react,
        react.configs['jsx-runtime'],
        replace(JsxStyleReplaceList, ['react'], ['@stylistic/jsx']),
        {
            '@eslint-react/no-leaked-conditional-rendering': 1,
            '@eslint-react/no-missing-key': 2,
            '@eslint-react/no-nested-components': 1,
            '@eslint-react/no-redundant-should-component-update': 2,
            '@eslint-react/no-set-state-in-component-did-mount': 1,
            '@eslint-react/no-set-state-in-component-did-update': 1,
            '@eslint-react/no-set-state-in-component-will-update': 1,
            '@eslint-react/no-string-refs': 2,
            '@eslint-react/no-unsafe-component-will-mount': 1,
            '@eslint-react/no-unsafe-component-will-receive-props': 1,
            '@eslint-react/no-unsafe-component-will-update': 1,
            '@eslint-react/no-unstable-context-value': 2,
            '@eslint-react/no-unstable-default-props': 2,
            '@eslint-react/no-unused-class-component-members': 1,
            '@eslint-react/no-unused-state': 1,
            '@eslint-react/no-useless-fragment': 1,
            '@eslint-react/prefer-destructuring-assignment': 1,
            '@eslint-react/prefer-shorthand-boolean': 1,
            '@eslint-react/prefer-shorthand-fragment': 1,
            '@stylistic/jsx/jsx-curly-brace-presence': [1, { children: 'never', propElementValues: 'always', props: 'never' }],
            'use-memo/require-usememo': 2,
            'validate-jsx-nesting/no-invalid-jsx-nesting': 2
        }
    ]
}
