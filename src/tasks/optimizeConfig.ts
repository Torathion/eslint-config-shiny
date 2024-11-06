import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { ShinyConfig } from 'src/types'
import { optimizeRules } from 'src/utils'

function renamePlugins(plugins: Record<string, FlatConfig.Plugin>, renames: Record<string, string>): void {
    if (!plugins) return
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
}

function trimPlugins(plugins: Record<string, FlatConfig.Plugin>, trims: string[]): void {
    const len = trims.length
    let i: number, trim: string
    for (const name of Object.keys(plugins)) {
        for (i = len - 1; i >= 0; i--) {
            trim = trims[i]
            if (name.startsWith(trim)) {
                plugins[name.replace(trim, '')] = plugins[name]
                delete plugins[name]
                break
            }
        }
    }
}

export default function optimizeConfigs(configs: FlatConfig.Config[], opts: ShinyConfig, isCached: boolean): void {
    const renames = opts.rename
    const trims = opts.trim
    let config: FlatConfig.Config
    for (let i = configs.length - 1; i >= 0; i--) {
        config = configs[i]
        if (config.plugins) {
            renamePlugins(config.plugins, renames)
            trimPlugins(config.plugins, trims)
        }
        if (config.rules && !isCached) optimizeRules(config.rules, renames, trims)
    }
}
