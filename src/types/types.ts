export type RuleLevel = number | 'error' | 'warn' | 'off'
export type OptionsObject = Record<string, unknown>
export type ArrayOption = [RuleLevel, OptionsObject]
export type ArrayTypeOption = [RuleLevel, string]
export type ArrayTypeObjectOption = [RuleLevel, string, OptionsObject]
export type RuleValue = RuleLevel | ArrayOption | ArrayTypeOption | ArrayTypeObjectOption
export type Rules = Record<string, RuleValue>
export type Profile =
    | 'angular'
    | 'web'
    | 'cypress'
    | 'format'
    | 'fp'
    | 'jest'
    | 'json'
    | 'node'
    | 'react'
    | 'shiny'
    | 'test'
    | 'test-angular'
    | 'test-web'
    | 'test-react'
    | 'test-vue'
    | 'tsdoc'
    | 'vitest'
    | 'vue'
