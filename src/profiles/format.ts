import perfectionist from 'eslint-plugin-perfectionist'

import type { ProfileConfig } from '../types/interfaces'
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
                        'static-property',
                        'private-property',
                        'property',
                        'constructor',
                        'method',
                        'private-method',
                        'static-method',
                        'unknown'
                    ],
                    order: 'asc',
                    type: 'alphabetical'
                }
            ],
            'perfectionist/sort-imports': 0,
            'perfectionist/sort-intersection-types': 0,
            'perfectionist/sort-jsx-props': 0,
            'perfectionist/sort-union-types': 0,
            'perfectionist/sort-vue-attributes': 0
        }
    ]
}
