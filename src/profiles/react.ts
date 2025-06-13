import react from '@eslint-react/eslint-plugin'
import styleJsx from '@stylistic/eslint-plugin-jsx'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHookForm from 'eslint-plugin-react-hook-form'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPerf from 'eslint-plugin-react-perf'
import reactPreferFC from 'eslint-plugin-react-prefer-function-component'
import reactRedux from 'eslint-plugin-react-redux'
import reactRefresh from 'eslint-plugin-react-refresh'
import validJsxNesting from 'eslint-plugin-validate-jsx-nesting'

import { ALWAYS, NEVER } from 'src/constants'
import type { ProfileConfig, ProjectMetadata } from '../types/interfaces'
import type { DeepPartial } from 'typestar'

const JSExtensions = ['.mjsx', '.jsx']
const TSExtensions = ['.mtsx', '.tsx']

export default function reactConfig(_metadata: ProjectMetadata): DeepPartial<ProfileConfig> {
    return {
        apply: {
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
        extends: ['web', react.configs['recommended-typescript']],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        name: 'react',
        plugins: {
            'jsx-a11y': jsxA11y,
            'react-refresh': reactRefresh,
            styleJsx,
            'validate-jsx-nesting': validJsxNesting
        },
        rules: [
            jsxA11y.flatConfigs.recommended,
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
                'styleJsx/jsx-child-element-spacing': 1,
                'styleJsx/jsx-closing-bracket-location': [1, 'line-aligned'],
                'styleJsx/jsx-closing-tag-location': [1, 'tag-aligned'],
                'styleJsx/jsx-curly-brace-presence': [1, { children: NEVER, propElementValues: ALWAYS, props: NEVER }],
                'styleJsx/jsx-curly-newline': 1,
                'styleJsx/jsx-curly-spacing': [1, { attributes: { allowMultiline: false }, children: true, when: NEVER }],
                'styleJsx/jsx-equals-spacing': 1,
                'styleJsx/jsx-first-prop-new-line': 1,
                'styleJsx/jsx-function-call-newline': 1,
                'styleJsx/jsx-newline': [1, { prevent: true }],
                'styleJsx/jsx-one-expression-per-line': [1, { allow: 'single-line' }],
                'styleJsx/jsx-pascal-case': [1, { allowNamespace: true }],
                'styleJsx/jsx-props-no-multi-spaces': 1,
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
                'validate-jsx-nesting/no-invalid-jsx-nesting': 2
            }
        ],
        settings: {
            'import/extensions': [...JSExtensions, ...TSExtensions],
            'import/parsers': {
                '@typescript-eslint/parser': TSExtensions,
                espree: JSExtensions
            }
        }
    }
}
