import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'

import type { ESLint } from 'eslint'
import hasRecommendedConfig from '../guards/hasRecommendedConfig'
import { keysOf, refMergeObj } from 'compresso'

export default function apply(pluginMap?: Record<string, ESLint.Plugin>): Partial<FlatConfig.Config> {
    const config: Partial<FlatConfig.Config> = { plugins: {}, rules: {} }
    if (!pluginMap) return config
    const keys = keysOf(pluginMap)
    const len = keys.length
    let key: string, plugin: ESLint.Plugin
    for (let i = 0; i < len; i++) {
        key = keys[i]
        plugin = pluginMap[key]
        config.plugins![key] = plugin
        if (hasRecommendedConfig(plugin)) config.rules = refMergeObj(config.rules!, plugin.configs!.recommended.rules)
    }
    return config
}
