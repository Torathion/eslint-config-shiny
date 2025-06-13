import type { FlatConfig, SharedConfig } from '@typescript-eslint/utils/ts-eslint'
import type { MaybeArray, Obj } from 'typestar'

export type ArrayOption = [SharedConfig.RuleLevel, Obj]
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
