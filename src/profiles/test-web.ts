import testingLibrary from 'eslint-plugin-testing-library'

import type { PartialProfileConfig } from '../types/interfaces'

/**
 *   Array of basic browser testing eslint configs
 */
export default function testWeb(): PartialProfileConfig {
    return {
        extends: ['test-base'],
        name: 'test-web',
        plugins: { 'testing-library': testingLibrary },
        rules: [testingLibrary.configs.dom!]
    }
}
