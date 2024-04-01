import storybook from 'eslint-plugin-storybook'
import testingLibrary from 'eslint-plugin-testing-library'

import { apply, mergeRules } from '../tasks'
import { base } from './base'
import testBase from './test-base'
import merge from '../utils/merge'
import type { ProfileConfig } from '../types/interfaces'

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
        plugins: merge(base.plugins!, testBase.plugins, { 'testing-library': testingLibrary }),
        rules: mergeRules(base, testBase, testingLibrary.configs.dom)
    }
] as ProfileConfig[]
