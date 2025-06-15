import type { DeepPartial } from 'typestar'
import style from '@stylistic/eslint-plugin'
import perfectionist from 'eslint-plugin-perfectionist'

import { ALWAYS, FIELD, METHOD, NEVER } from 'src/constants'
import type { ProfileConfig, ProjectMetadata } from '../types/interfaces'

export default function format(_metadata: ProjectMetadata): DeepPartial<ProfileConfig> {
  return {
    extends: [perfectionist.configs['recommended-natural']],
    name: 'format',
    plugins: {
      style
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
        'style/array-bracket-spacing': 1,
        'style/computed-property-spacing': 1,
        'style/dot-location': [1, 'property'],
        'style/eol-last': 1,
        'style/generator-star-spacing': [1, 'after'],
        'style/implicit-arrow-linebreak': 1,
        'style/multiline-comment-style': 1,
        'style/new-parens': 1,
        'style/no-confusing-arrow': 1,
        'style/no-floating-decimal': 1,
        'style/no-mixed-spaces-and-tabs': [1, 'smart-tabs'],
        'style/no-multi-spaces': 1,
        'style/no-multiple-empty-lines': 1,
        'style/no-trailing-spaces': 1,
        'style/no-whitespace-before-property': 1,
        'style/nonblock-statement-body-position': 1,
        'style/rest-spread-spacing': [1, NEVER],
        'style/space-in-parens': 1,
        'style/space-unary-ops': [1, { nonwords: false, words: true }],
        'style/spaced-comment': [1, ALWAYS],
        'style/switch-colon-spacing': 1,
        'style/template-curly-spacing': 1,
        'style/template-tag-spacing': 1,
        'style/wrap-iife': [1, 'inside'],
        'style/yield-star-spacing': 1,
        'style/brace-style': 1,
        'style/function-call-spacing': 1,
        'style/key-spacing': 1,
        'style/keyword-spacing': 1,
        'style/lines-between-class-members': [
          1,
          {
            enforce: [
              { blankLine: NEVER, next: FIELD, prev: FIELD },
              { blankLine: ALWAYS, next: METHOD, prev: FIELD },
              { blankLine: ALWAYS, next: METHOD, prev: METHOD }
            ]
          }
        ],
        'style/space-before-blocks': 1,
        'style/space-before-function-paren': [
          1,
          {
            anonymous: ALWAYS,
            asyncArrow: ALWAYS,
            named: NEVER
          }
        ],
        'style/space-infix-ops': 1,
        'style/type-annotation-spacing': 1
      }
    ]
  }
}
