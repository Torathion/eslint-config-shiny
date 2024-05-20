export type RuleLevel = number | 'error' | 'off' | 'warn'
export type OptionsObject = Record<string, unknown>
export type ArrayOption = [RuleLevel, OptionsObject]
export type MaybeArray<T> = T | T[]
// export type ArrayTypeOption = [RuleLevel, string]
// export type ArrayTypeObjectOption = [RuleLevel, string, OptionsObject]
// export type RuleValue = RuleLevel | ArrayOption | ArrayTypeOption | ArrayTypeObjectOption
// export type Rules = Record<string, RuleValue>
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
