import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { Obj } from 'typestar'

export default function isFlatConfig(config: Obj): config is FlatConfig.Config {
  return (
    !!config.rules ||
    !!config.languageOptions ||
    !!config.linterOptions ||
    !config.env ||
    !config.parserOptions ||
    !config.extends ||
    !config.overrides
  )
}
