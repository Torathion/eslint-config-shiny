import noOnlyTests from 'eslint-plugin-no-only-tests'
import globals from 'globals'

import type { ProfileConfig, ProjectMetadata } from '../types/interfaces'
import { TestGlobs } from '../globs'
import type { DeepPartial } from 'typestar'

export default function testBase(_metadata: ProjectMetadata): DeepPartial<ProfileConfig> {
    return {
        extends: ['empty'],
        files: TestGlobs,
        languageOptions: {
            globals: globals.jest
        },
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
