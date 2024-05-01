import type { Linter } from 'eslint'

export default function isFlatConfig(config: Record<any, any>): config is Linter.FlatConfig {
    return !!config.languageOptions || !!config.linterOptions || !config.env || !config.parserOptions || !config.extends || !config.overrides
}
