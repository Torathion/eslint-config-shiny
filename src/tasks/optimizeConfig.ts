import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { ShinyConfig } from 'src/types'
import { optimizeRules } from 'src/utils'

function renamePlugins(plugins: Record<string, FlatConfig.Plugin>, renames: Record<string, string>): Record<string, FlatConfig.Plugin> {
    if (!plugins) return plugins
    for (const name of Object.keys(plugins)) {
        for (const key of Object.keys(renames)) {
            if (name === key) {
                plugins[renames[key]] = plugins[key]
                delete plugins[key]
                break
            } else if (name.startsWith(key)) {
                plugins[name.replace(key, renames[key]).replaceAll('/', '-')] = plugins[name]
                delete plugins[name]
                break
            }
        }
    }

    return plugins
}

export default function optimizeConfigs(configs: FlatConfig.Config[], opts: ShinyConfig, isCached: boolean): void {
    const renames = opts.rename
    let config: FlatConfig.Config
    for (let i = configs.length - 1; i >= 0; i--) {
        config = configs[i]
        if (config.plugins) renamePlugins(config.plugins, renames)
        if (config.rules && !isCached) optimizeRules(config.rules, renames)
    }
}
