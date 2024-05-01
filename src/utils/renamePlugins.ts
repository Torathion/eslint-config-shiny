import type { Linter } from 'eslint'

export default function renamePlugins(config: Linter.FlatConfig, renames: Record<string, string>): void {
    if (!config.plugins) return
    const keys = Object.keys(renames)
    for (const key of keys) {
        if (config.plugins[key]) {
            config.plugins[renames[key]] = config.plugins[key]
            delete config.plugins[key]
        }
    }
}
