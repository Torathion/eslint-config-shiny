import noOnlyTests from 'eslint-plugin-no-only-tests'
import globals from 'globals'

import type { PartialProfileConfig, ProjectMetadata } from '../types/interfaces'
import { TestGlobs } from '../globs'

export default function testBase(_metadata: ProjectMetadata): PartialProfileConfig {
    return {
        files: TestGlobs,
        languageOptions: {
            globals: globals.jest
        },
        extends: ['empty'],
        name: 'test-base',
        plugins: {
            'no-only-tests': noOnlyTests
        },
        rules: [
            {
                'no-only-tests/no-only-tests': 2
            }
        ]
    }
}
