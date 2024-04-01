import globals from 'globals'

import noOnlyTests from 'eslint-plugin-no-only-tests'

import { TestGlobs } from '../globs'
import type { ProfileConfig } from '../types/interfaces'

const testBase: Partial<ProfileConfig> = {
    extends: ['base'],
    files: TestGlobs,
    languageOptions: {
        globals: globals.jest
    },
    plugins: {
        'no-only-tests': noOnlyTests
    },
    rules: {
        'no-only-tests/no-only-tests': 2
    }
}

export default testBase
