import type { ESLint } from 'eslint'
import hasRecommendedConfig from '../utils/hasRecommendedConfig'
import type { ProfileConfig } from '../types/interfaces'
import { EmptyProfileConfig } from 'src/constants'

export default function apply(pluginMap: Record<string, ESLint.Plugin>): ProfileConfig {
    const keys = Object.keys(pluginMap)
    const len = keys.length
    const config: ProfileConfig = { ...EmptyProfileConfig }
    let key: string, plugin: ESLint.Plugin
    for (let i = 0; i < len; i++) {
        key = keys[i]
        plugin = pluginMap[key]
        config.plugins[key] = plugin
        if (hasRecommendedConfig(plugin)) config.rules = Object.assign(config.rules, plugin.configs!.recommended.rules)
    }
    return config
}
