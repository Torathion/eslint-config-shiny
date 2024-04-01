import type { SourceType } from './types/types'

export const cwd = process.cwd()
export const EmptyProfileConfig = {
    plugins: {},
    rules: {},
    files: [],
    ignores: [],
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module' as SourceType,
        globals: {},
        parser: {} as any
    },
    linterOptions: {},
    processor: '',
    settings: {}
}
