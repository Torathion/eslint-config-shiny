import type { ESLint, Linter } from 'eslint'

import hasRecommendedConfig from '../utils/hasRecommendedConfig'

export default function apply(pluginMap: Record<string, ESLint.Plugin>): Partial<Linter.FlatConfig> {
    const keys = Object.keys(pluginMap)
    const len = keys.length
    const config: Partial<Linter.FlatConfig> = { plugins: {}, rules: {} }
    let key: string, plugin: ESLint.Plugin
    for (let i = 0; i < len; i++) {
        key = keys[i]
        plugin = pluginMap[key]
        config.plugins![key] = plugin
        if (hasRecommendedConfig(plugin)) config.rules = Object.assign(config.rules!, plugin.configs!.recommended.rules)
    }
    return config
}
