export type RuleLevel = number | 'error' | 'off' | 'warn'
export type OptionsObject = Record<string, unknown>
export type ArrayOption = [RuleLevel, OptionsObject]
export type MaybeArray<T> = T | T[]
export type SourceType = 'commonjs' | 'module' | 'script'
export type Profile =
    | 'angular'
    | 'base'
    | 'cypress'
    | 'format'
    | 'fp'
    | 'jest'
    | 'json'
    | 'node'
    | 'react'
    | 'test-angular'
    | 'test-base'
    | 'test-react'
    | 'test-vue'
    | 'test-web'
    | 'tsdoc'
    | 'vitest'
    | 'vue'
    | 'web'
