import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { AnyObject } from 'typestar'

export default function isFlatConfig(config: AnyObject): config is FlatConfig.Config {
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
