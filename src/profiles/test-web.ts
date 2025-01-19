import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig } from '../types/interfaces'

/**
 *   Array of basic browser testing eslint configs
 */
export default [
    {
        extends: ['test-base'],
        name: 'test-web',
        plugins: { 'testing-library': testingLibrary },
        rules: [testingLibrary.configs.dom]
    }
] as Partial<ProfileConfig>[]
