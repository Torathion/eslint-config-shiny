import storybook from 'eslint-plugin-storybook'
import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig } from '../types/interfaces'

/**
 *   Array of basic browser testing eslint configs
 */
export default [
    {
        name: 'test-web',
        extends: ['test-base'],
        plugins: { 'testing-library': testingLibrary },
        rules: [testingLibrary.configs.dom]
    },
    {
        name: 'storybook',
        apply: { storybook },
        files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)']
    }
] as Partial<ProfileConfig>[]
