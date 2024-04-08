import perfectionist from 'eslint-plugin-perfectionist'
import type { ProfileConfig } from '../types/interfaces'

/**
 *   Array of formatting configs
 */
export const config: Partial<ProfileConfig> = {
    extends: [perfectionist.configs['recommended-natural']],
    plugins: {
        perfectionist
    },
    rules: [
        {
            'perfectionist/sort-classes': [
                2,
                {
                    type: 'alphabetical',
                    order: 'asc',
                    groups: ['static-property', 'private-property', 'property', 'constructor', 'method', 'private-method', 'static-method', 'unknown']
                }
            ],
            'perfectionist/sort-vue-attributes': 0,
            'perfectionist/sort-imports': 0
        }
    ]
}
