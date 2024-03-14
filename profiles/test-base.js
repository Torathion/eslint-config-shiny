import globals from 'globals'

import noOnlyTests from 'eslint-plugin-no-only-tests'

const testBase = {
    files: ['test/**/*.test.ts', 'test/**/*.spec.ts', '**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
        globals: {
            ...globals.jest
        }
    },
    plugins: {
        'no-only-tests': noOnlyTests
    },
    rules: {
        'no-only-tests/no-only-tests': 2
    }
}

export default testBase
