import perfectionistConfig from 'eslint-plugin-perfectionist/configs/recommended-natural'

import type { ProfileConfig } from '../types/interfaces'
/**
 *   Array of formatting configs
 */
export const config: Partial<ProfileConfig> = {
    extends: [perfectionistConfig],
    name: 'format',
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
            'perfectionist/sort-union-types': 0,
            'perfectionist/sort-vue-attributes': 0
        }
    ]
}
