import styleJs from '@stylistic/eslint-plugin-js'
import styleTs from '@stylistic/eslint-plugin-ts'
import perfectionist from 'eslint-plugin-perfectionist'
import { ALWAYS, FIELD, METHOD, NEVER } from 'src/constants'

import type { PartialProfileConfig, ProjectMetadata } from '../types/interfaces'

export default function format(_metadata: ProjectMetadata): PartialProfileConfig {
    return {
        extends: [perfectionist.configs['recommended-natural']],
        name: 'format',
        plugins: {
            styleJs,
            styleTs
        },
        rules: [
            {
                'perfectionist/sort-classes': [
                    2,
                    {
                        groups: [
                            'index-signature',
                            'static-property',
                            'static-block',
                            ['protected-property', 'protected-accessor-property'],
                            ['private-property', 'private-accessor-property'],
                            ['property', 'accessor-property'],
                            'constructor',
                            'protected-method',
                            'private-method',
                            'method',
                            'static-method',
                            ['get-method', 'set-method'],
                            'unknown'
                        ]
                    }
                ],
                'perfectionist/sort-imports': [
                    'error',
                    {
                        customGroups: {
                            type: {
                                react: ['^react$', '^react-.']
                            },
                            value: {
                                react: ['^react$', '^react-.']
                            }
                        },
                        groups: [
                            'react',
                            'builtin',
                            'builtin-type',
                            'external-type',
                            'external',
                            ['internal', 'internal-type'],
                            ['parent-type', 'sibling-type', 'index-type'],
                            ['parent', 'sibling', 'index'],
                            'side-effect',
                            'object',
                            'style',
                            'unknown'
                        ],
                        newlinesBetween: 'ignore',
                        order: 'asc',
                        type: 'natural'
                    }
                ],
                'perfectionist/sort-intersection-types': 0,
                'perfectionist/sort-jsx-props': 0,
                'perfectionist/sort-union-types': 0,
                'styleJs/array-bracket-spacing': 1,
                'styleJs/computed-property-spacing': 1,
                'styleJs/dot-location': [1, 'property'],
                'styleJs/eol-last': 1,
                'styleJs/generator-star-spacing': [1, 'after'],
                'styleJs/implicit-arrow-linebreak': 1,
                'styleJs/multiline-comment-style': 1,
                'styleJs/new-parens': 1,
                'styleJs/no-confusing-arrow': 1,
                'styleJs/no-floating-decimal': 1,
                'styleJs/no-mixed-spaces-and-tabs': [1, 'smart-tabs'],
                'styleJs/no-multi-spaces': 1,
                'styleJs/no-multiple-empty-lines': 1,
                'styleJs/no-trailing-spaces': 1,
                'styleJs/no-whitespace-before-property': 1,
                'styleJs/nonblock-statement-body-position': 1,
                'styleJs/rest-spread-spacing': [1, NEVER],
                'styleJs/space-in-parens': 1,
                'styleJs/space-unary-ops': [1, { nonwords: false, words: true }],
                'styleJs/spaced-comment': [1, ALWAYS],
                'styleJs/switch-colon-spacing': 1,
                'styleJs/template-curly-spacing': 1,
                'styleJs/template-tag-spacing': 1,
                'styleJs/wrap-iife': [1, 'inside'],
                'styleJs/yield-star-spacing': [1, 'after'],
                'styleTs/brace-style': 1,
                'styleTs/function-call-spacing': 1,
                'styleTs/key-spacing': 1,
                'styleTs/keyword-spacing': 1,
                'styleTs/lines-between-class-members': [
                    1,
                    {
                        enforce: [
                            { blankLine: NEVER, next: FIELD, prev: FIELD },
                            { blankLine: ALWAYS, next: METHOD, prev: FIELD },
                            { blankLine: ALWAYS, next: METHOD, prev: METHOD }
                        ]
                    }
                ],
                'styleTs/space-before-blocks': 1,
                'styleTs/space-before-function-paren': [
                    1,
                    {
                        anonymous: ALWAYS,
                        asyncArrow: ALWAYS,
                        named: NEVER
                    }
                ],
                'styleTs/space-infix-ops': 1,
                'styleTs/type-annotation-spacing': 1
            }
        ]
    }
}
