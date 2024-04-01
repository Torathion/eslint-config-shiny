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
        apply: { storybook },
        files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)']
    },
    {
        extends: ['test-base'],
        plugins: { 'testing-library': testingLibrary },
        rules: testingLibrary.configs.dom
    }
] as Partial<ProfileConfig>[]
