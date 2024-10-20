import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'

export default function renamePlugins(
    plugins: Record<string, FlatConfig.Plugin>,
    renames: Record<string, string>
): Record<string, FlatConfig.Plugin> {
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
