import storybook from 'eslint-plugin-storybook'
import testingLibrary from 'eslint-plugin-testing-library'

import { base } from './base.js'
import testBase from './test-base.js'

/**
 *   Array of basic browser testing eslint configs
 */
export default [
    {
        files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
        plugins: {
            storybook
        },
        rules: {
            ...storybook.configs.recommended.rules
        }
    },
    {
        ...base,
        ...testBase,
        plugins: {
            ...base.plugins,
            ...testBase.plugins,
            'testing-library': testingLibrary
        },
        rules: {
            ...base.rules,
            ...testBase.rules,
            ...testingLibrary.configs.dom.rules
        }
    }
]
