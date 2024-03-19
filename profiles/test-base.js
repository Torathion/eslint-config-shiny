import globals from 'globals'

import noOnlyTests from 'eslint-plugin-no-only-tests'

import { ExcludeGlobs, TestGlobs } from '../dist/index.js'

const testBase = {
    files: TestGlobs,
    ignores: ExcludeGlobs,
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
