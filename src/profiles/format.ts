import perfectionist from 'eslint-plugin-perfectionist'

import type { ProfileConfig } from '../types/interfaces'

const partition = {
    partitionByComment: true,
    partitionByNewLine: true
}
/**
 *   Array of formatting configs
 */
export const config: Partial<ProfileConfig> = {
    name: 'format',
    extends: [perfectionist.configs['recommended-natural']],
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
                    groups: [
                        'type',
                        ['parent-type', 'sibling-type', 'index-type'],
                        'builtin',
                        'external',
                        ['internal', 'internal-type'],
                        ['parent', 'sibling', 'index'],
                        'side-effect',
                        'object',
                        'unknown'
                    ],
                    newlinesBetween: 'ignore',
                    order: 'asc',
                    type: 'natural'
                }
            ],
            'perfectionist/sort-intersection-types': 0,
            'perfectionist/sort-jsx-props': 0,
            'perfectionist/sort-union-types': 0
        }
    ]
}
