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
import stylisticJsx from '@stylistic/eslint-plugin-jsx'

import type { PartialProfileConfig } from '../types/interfaces'
// INFO: remove jsx-a11y until https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/pull/891 is passed

const plugins = react.configs.all.plugins

export const config: PartialProfileConfig = {
    apply: {
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
    plugins: {
        '@stylistic/jsx': stylisticJsx,
        react,
        'react/dom': plugins['@eslint-react/dom'],
        'react/hooks-extra': plugins['@eslint-react/hooks-extra'],
        'react/naming-convention': plugins['@eslint-react/naming-convention'],
        'react-refresh': reactRefresh,
        'use-memo': useMemo,
        'validate-jsx-nesting': validJsxNesting
    },
    rules: [
        react.configs['recommended-type-checked'],
        {
            'sdl/react-iframe-missing-sandbox': 2,
            'react/no-leaked-conditional-rendering': 2,
            'react/hooks-extra/ensure-custom-hooks-using-other-hooks': 2,
            'react/hooks-extra/ensure-use-memo-has-non-empty-deps': 2,
            'react/hooks-extra/prefer-use-state-lazy-initialization': 2,
            'react/naming-convention/component-name': [2, 'PascalCase'],
            'react/naming-convention/filename': [2, 'PascalCase'],
            'react/naming-convention/filename-extension': 2,
            'react/naming-convention/use-state': 2,
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
            '@stylistic/jsx/jsx-curly-brace-presence': [1, { children: 'never', propElementValues: 'always', props: 'never' }],
            '@stylistic/jsx/jsx-closing-tag-location': 1,
            '@stylistic/jsx/jsx-curly-newline': 1,
            '@stylistic/jsx/jsx-curly-spacing': [1, { when: 'never', attributes: { allowMultiline: false }, children: true }],
            '@stylistic/jsx/jsx-equals-spacing': [1, 'never'],
            '@stylistic/jsx/jsx-first-prop-new-line': 1,
            '@stylistic/jsx/jsx-function-call-newline': 1,
            '@stylistic/jsx/jsx-max-props-per-line': [1, { maximum: { single: 5, multi: 1 } }],
            '@stylistic/jsx/jsx-newline': [1, { prevent: true }],
            '@stylistic/jsx/jsx-one-expression-per-line': [1, { allow: 'single-line' }],
            '@stylistic/jsx/jsx-self-closing-comp': [1, { component: true, html: true }],
            '@stylistic/jsx/jsx-sort-props': [
                1,
                {
                    shorthandFirst: true,
                    callbacksLast: true,
                    ignoreCase: true,
                    multiline: 'last',
                    locale: 'auto'
                }
            ],
            '@stylistic/jsx/jsx-tag-spacing': 1,
            '@stylistic/jsx/jsx-wrap-multilines': 1,
            'use-memo/require-usememo': 2,
            'validate-jsx-nesting/no-invalid-jsx-nesting': 2
        }
    ]
}
