import type { ShinyConfig } from 'src/types'

/**
 *  Searches for a fitting rename that has been applied to the plugin. If the plugin hasn't been renamed, just return it back.
 *
 *  @param renameMap - list of all possible renames.
 *  @param keys - list of applied renames.
 *  @param plugin - target plugin.
 *  @returns the patched dependency name.
 */
function findMatchingKey(renameMap: Record<string, string>, keys: string[], plugin: string): string {
    for (const key of keys) if (renameMap[key] === plugin) return key
    return plugin
}

/**
 *  Inverts the applied rename of the plugin.
 *
 *  @param plugin - renamed plugin
 *  @param opts - eslint-config-shiny options
 *  @param renameKeys - keys of the dictionary of all renames
 *  @param renameValues - values of the dictionary of all renames
 *  @returns the original plugin name.
 */
export default function invertRename(plugin: string, opts: ShinyConfig, renameKeys: string[], renameValues: string[]): string {
    return renameValues.includes(plugin) ? findMatchingKey(opts.rename, renameKeys, plugin) : plugin
}
