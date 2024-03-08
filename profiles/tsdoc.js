import tsdoc from 'eslint-plugin-tsdoc'

export default {
    files: ['**/*.ts', '**/*.d.ts', '**/*.tsx', '**/*.vue'],
    plugins: {
        tsdoc
    },
    rules: {
        'tsdoc/syntax': 1
    }
}
