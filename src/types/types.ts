import type { MaybeArray } from 'typestar'
import type { FlatConfig, SharedConfig } from '@typescript-eslint/utils/ts-eslint'

export type OptionsObject = Record<string, unknown>
export type ArrayOption = [SharedConfig.RuleLevel, OptionsObject]
export type SourceType = 'commonjs' | 'module' | 'script'
export type ProfileRules = SharedConfig.RulesRecord | MaybeArray<FlatConfig.Config>
export type Profile =
    | 'base'
    | 'format'
    | 'jest'
    | 'node'
    | 'react'
    | 'test-base'
    | 'test-react'
    | 'test-vue'
    | 'test-web'
    | 'tsdoc'
    | 'vitest'
    | 'vue'
    | 'web'
