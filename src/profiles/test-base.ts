import globals from 'globals'

import noOnlyTests from 'eslint-plugin-no-only-tests'

import { ExcludeGlobs, TestGlobs } from '../globs'
import type { ProfileConfig } from '../types/interfaces'
import { base } from './base'

const testBase: ProfileConfig = {
    ...base,
    files: TestGlobs,
    ignores: ExcludeGlobs,
    languageOptions: {
        ...base.languageOptions,
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
