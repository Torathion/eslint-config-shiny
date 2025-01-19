import type { FlatConfig, SharedConfig } from '@typescript-eslint/utils/ts-eslint'
import type { AnyObject, MaybeArray, Rejector, Resolver } from 'typestar'

export type ArrayOption = [SharedConfig.RuleLevel, AnyObject]
export type CancelablePromiseCallback<T> = (resolve: Resolver<T>, reject: Rejector, onCancel: (cancelHandler: () => void) => void) => void
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
    | 'empty'
export type ProfileRules = SharedConfig.RulesRecord | MaybeArray<FlatConfig.Config>
export type SourceType = 'commonjs' | 'module' | 'script'
