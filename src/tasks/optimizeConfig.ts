import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { ShinyConfig } from 'src/types'
import type { Dict } from 'typestar'
import { keysOf } from 'compresso'
import { optimizeRules } from 'src/utils'

export default function optimizeConfigs(configs: FlatConfig.Config[], opts: ShinyConfig, isCached: boolean): void {
    const { numericValues, renames: shouldRename, trims: shouldTrim } = opts.optimizations
    // Nothing to optimize, return!
    if (!shouldRename && !shouldTrim && !numericValues) return
    const renames = opts.rename
    const trims = opts.trim
    let config: FlatConfig.Config
    for (let i = configs.length - 1; i >= 0; i--) {
        config = configs[i]
        if (config.plugins) {
            shouldRename && renamePlugins(config.plugins, renames)
            shouldTrim && trimPlugins(config.plugins, trims)
        }
        if (config.rules && !isCached) optimizeRules(opts, config.rules, renames, trims)
    }
}

function renamePlugins(plugins: Record<string, FlatConfig.Plugin>, renames: Dict): void {
    if (!plugins) return
    const renameKeys = keysOf(renames)
    // Go through each plugin
    for (const name of keysOf(plugins)) {
        // Match each name with each rename
        for (const key of renameKeys) {
            // If plugin name equals name, directly replace
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
    for (const name of keysOf(plugins)) {
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
