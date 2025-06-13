import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig } from '../types/interfaces'
import type { DeepPartial } from 'typestar'

/**
 *   Array of basic browser testing eslint configs
 */
export default function testWeb(): DeepPartial<ProfileConfig> {
    return {
        extends: ['test-base'],
        name: 'test-web',
        plugins: { 'testing-library': testingLibrary },
        rules: [testingLibrary.configs['flat/dom']]
    }
}
