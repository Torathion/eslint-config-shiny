import type { ProfileConfig } from './types/interfaces'
import type { SourceType } from './types/types'

export const cwd = process.cwd()
export const EmptyProfileConfig: ProfileConfig = {
    apply: {},
    extends: [],
    files: [],
    ignores: [],
    languageOptions: {
        ecmaVersion: 'latest',
        globals: {},
        parser: {} as any,
        sourceType: 'module' as SourceType
    },
    linterOptions: {},
    plugins: {},
    rules: [],
    settings: {}
}
