import reactFormFields from 'eslint-plugin-react-form-fields'
import reactHookForm from 'eslint-plugin-react-hook-form'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPerf from 'eslint-plugin-react-perf'
import reactPreferFC from 'eslint-plugin-react-prefer-function-component'
import reactRedux from 'eslint-plugin-react-redux'
import useMemo from '@arthurgeron/eslint-plugin-react-usememo'
import validJsxNesting from 'eslint-plugin-validate-jsx-nesting'
import react from '@eslint-react/eslint-plugin'
import reactRefresh from 'eslint-plugin-react-refresh'
import styleJsx from '@stylistic/eslint-plugin-jsx'
import sdl from '@microsoft/eslint-plugin-sdl'

import type { PartialProfileConfig } from '../types/interfaces'
// INFO: remove jsx-a11y until https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/pull/891 is passed

export const config: PartialProfileConfig = {
    apply: {
        'react-form-fields': reactFormFields,
        'react-hook-form': reactHookForm,
        'react-hooks': reactHooks,
        'react-perf': reactPerf,
        'react-prefer-function-component': reactPreferFC,
        'react-redux': reactRedux
    },
    cache: {
        mapper: {
            '@eslint-react/debug': 'eslint-plugin-react-debug',
            '@eslint-react/dom': 'eslint-plugin-react-dom',
            '@eslint-react/hooks-extra': 'eslint-plugin-react-hooks-extra',
            '@eslint-react/naming-convention': 'eslint-plugin-react-naming-convention',
            '@eslint-react/web-api': 'eslint-plugin-react-web-api',
            '@eslint-react/x': 'eslint-plugin-react-x'
        }
    },
    extends: ['web', react.configs['recommended-type-checked']],
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true
            }
        }
    },
    name: 'react',
    plugins: {
        'react-refresh': reactRefresh,
        styleJsx,
        'use-memo': useMemo,
        'validate-jsx-nesting': validJsxNesting
    },
    rules: [
        sdl.configs.react,
        {
            'react-refresh/only-export-components': [
                2,
                {
                    allowConstantExport: true,
                    allowExportNames: [
                        'meta',
                        'links',
                        'headers',
                        'loader',
                        'action',
                        'config',
                        'generateStaticParams',
                        'metadata',
                        'generateMetadata',
                        'viewport',
                        'generateViewport'
                    ]
                }
            ],
            'styleJsx/jsx-closing-tag-location': 1,
            'styleJsx/jsx-curly-brace-presence': [1, { children: 'never', propElementValues: 'always', props: 'never' }],
            'styleJsx/jsx-curly-newline': 1,
            'styleJsx/jsx-curly-spacing': [1, { attributes: { allowMultiline: false }, children: true, when: 'never' }],
            'styleJsx/jsx-equals-spacing': [1, 'never'],
            'styleJsx/jsx-first-prop-new-line': 1,
            'styleJsx/jsx-function-call-newline': 1,
            'styleJsx/jsx-max-props-per-line': 0,
            'styleJsx/jsx-newline': [1, { prevent: true }],
            'styleJsx/jsx-one-expression-per-line': [1, { allow: 'single-line' }],
            'styleJsx/jsx-self-closing-comp': [1, { component: true, html: true }],
            'styleJsx/jsx-sort-props': [
                1,
                {
                    callbacksLast: true,
                    ignoreCase: true,
                    locale: 'auto',
                    multiline: 'last',
                    shorthandFirst: true
                }
            ],
            'styleJsx/jsx-tag-spacing': 1,
            'styleJsx/jsx-wrap-multilines': 1,
            'use-memo/require-usememo': 2,
            'validate-jsx-nesting/no-invalid-jsx-nesting': 2
        }
    ]
}
