import noOnlyTests from 'eslint-plugin-no-only-tests'
import globals from 'globals'

import type { PartialProfileConfig } from '../types/interfaces'
import { TestGlobs } from '../globs'

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
