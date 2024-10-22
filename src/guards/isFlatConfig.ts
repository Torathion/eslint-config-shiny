import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'

export default function isFlatConfig(config: Record<any, any>): config is FlatConfig.Config {
    return !!config.languageOptions || !!config.linterOptions || !config.env || !config.parserOptions || !config.extends || !config.overrides
}
