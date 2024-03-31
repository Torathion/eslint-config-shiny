import perfectionist from 'eslint-plugin-perfectionist'
import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural'
import type { ProfileConfig } from '../types/interfaces'

/**
 *   Array of formatting configs
 */
export default [
    perfectionistNatural,
    {
        plugins: {
            perfectionist
        },
        rules: {
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
    }
] as ProfileConfig[]
