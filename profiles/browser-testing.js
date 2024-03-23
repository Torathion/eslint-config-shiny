import storybook from 'eslint-plugin-storybook'
import testingLibrary from 'eslint-plugin-testing-library'

import { base } from './base.js'
import testBase from './test-base.js'

import { apply, merge, mergeRules } from '../dist/index.js'

/**
 *   Array of basic browser testing eslint configs
 */
export default [
    {
        files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
        ...apply({ storybook })
    },
    {
        ...base,
        ...testBase,
        plugins: merge(base.plugins, testBase.plugins, { 'testing-library': testingLibrary }),
        rules: mergeRules(base, testBase, testingLibrary.configs.dom)
    }
]
