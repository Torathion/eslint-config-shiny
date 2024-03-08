import noOnlyTests from 'eslint-plugin-no-only-tests'

const testBase = {
    files: ['**/*.ts', '**/*.d.ts', '**/*.tsx', '**/*.vue'],
    plugins: {
        'no-only-tests': noOnlyTests
    },
    rules: {
        'no-only-tests/no-only-tests': 2
    }
}

export default testBase
