import globals from 'globals'
import noOnlyTests from 'eslint-plugin-no-only-tests'

import { TestGlobs } from '../globs'
import type { PartialProfileConfig } from '../types/interfaces'

export const config: PartialProfileConfig = {
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
