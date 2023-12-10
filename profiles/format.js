import shopify from '@shopify/eslint-plugin'
import perfectionist from 'eslint-plugin-perfectionist'
import prettier from 'eslint-plugin-prettier'

import prettierConfig from 'eslint-config-prettier'
import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural'

/**
 *   Array of formatting configs
 */
export default [
    prettierConfig,
    perfectionistNatural,
    {
        plugins: {
            '@shopify': shopify,
            prettier,
            perfectionist
        },
        rules: {
            'prettier/prettier': [2, { endOfLine: 'auto' }],
            'perfectionist/sort-classes': [
                2,
                {
                    type: 'alphabetical',
                    order: 'asc',
                    groups: ['static-property', 'private-property', 'property', 'constructor', 'method', 'private-method', 'static-method', 'unknown']
                }
            ]
        }
    }
]
