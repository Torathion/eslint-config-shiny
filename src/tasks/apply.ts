import type { Config, Plugin } from '../types'
import hasRecommendedConfig from '../utils/hasRecommendedConfig'

export default function apply(pluginMap: Record<string, Plugin>): Config {
    const keys = Object.keys(pluginMap)
    const len = keys.length
    const config: Config = { plugins: {}, rules: {} }
    let key: string, plugin: Plugin
    for (let i = 0; i < len; i++) {
        key = keys[i]
        plugin = pluginMap[key]
        config.plugins[key] = plugin
        if (hasRecommendedConfig(plugin)) config.rules = Object.assign(config.rules, plugin.configs.recommended.rules)
    }
    return config
}
