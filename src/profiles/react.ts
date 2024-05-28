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
        react,
        'react/dom': plugins['@eslint-react/dom'],
        'react/hooks-extra': plugins['@eslint-react/hooks-extra'],
        'react/naming-convention': plugins['@eslint-react/naming-convention'],
        'react-refresh': reactRefresh,
        styleJsx,
        'use-memo': useMemo,
        'validate-jsx-nesting': validJsxNesting
    },
    rules: [
        react.configs['recommended-type-checked'],
        {
            'react/hooks-extra/ensure-custom-hooks-using-other-hooks': 2,
            'react/hooks-extra/ensure-use-memo-has-non-empty-deps': 2,
            'react/hooks-extra/prefer-use-state-lazy-initialization': 2,
            'react/naming-convention/component-name': [2, 'PascalCase'],
            'react/naming-convention/filename': [2, 'PascalCase'],
            'react/naming-convention/filename-extension': 2,
            'react/naming-convention/use-state': 2,
            'react/no-leaked-conditional-rendering': 2,
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
            'sdl/react-iframe-missing-sandbox': 2,
            'styleJsx/jsx-closing-tag-location': 1,
            'styleJsx/jsx-curly-brace-presence': [1, { children: 'never', propElementValues: 'always', props: 'never' }],
            'styleJsx/jsx-curly-newline': 1,
            'styleJsx/jsx-curly-spacing': [1, { attributes: { allowMultiline: false }, children: true, when: 'never' }],
            'styleJsx/jsx-equals-spacing': [1, 'never'],
            'styleJsx/jsx-first-prop-new-line': 1,
            'styleJsx/jsx-function-call-newline': 1,
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
