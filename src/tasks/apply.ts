import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'

import type { ESLint } from 'eslint'
import hasRecommendedConfig from '../guards/hasRecommendedConfig'

export default function apply(pluginMap: Record<string, ESLint.Plugin>): Partial<FlatConfig.Config> {
    const keys = Object.keys(pluginMap)
    const len = keys.length
    const config: Partial<FlatConfig.Config> = { plugins: {}, rules: {} }
    let key: string, plugin: ESLint.Plugin
    for (let i = 0; i < len; i++) {
        key = keys[i]
        plugin = pluginMap[key]
        config.plugins![key] = plugin
        if (hasRecommendedConfig(plugin)) config.rules = Object.assign(config.rules!, plugin.configs!.recommended.rules)
    }
    return config
}
