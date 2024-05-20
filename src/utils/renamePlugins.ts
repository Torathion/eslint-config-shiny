import type { ESLint } from 'eslint'

export default function renamePlugins(plugins: Record<string, ESLint.Plugin>, renames: Record<string, string>): Record<string, ESLint.Plugin> {
    if (!plugins) return plugins
    const keys = Object.keys(renames)
    for (const key of keys) {
        if (plugins[key]) {
            plugins[renames[key]] = plugins[key]
            delete plugins[key]
        }
    }
    return plugins
}
