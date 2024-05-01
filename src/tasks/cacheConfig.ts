import type { ESLint, Linter } from 'eslint'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { CacheData, LanguageOptions, ShinyConfig } from 'src/types/interfaces'

function findMatchingKey(renameMap: Record<string, string>, keys: string[], plugin: string): string {
    for (const key of keys) if (renameMap[key] === plugin) return key
    return plugin
}

// fixes organization string missing a @. This is mostly for the meta name of the tsParser
function patchOrgaString(name: string): string {
    return name.includes('/') && !name.includes('@') ? `@${name}` : name
}

export default async function cacheConfig(opts: ShinyConfig, parsedProfiles: Linter.FlatConfig[]): Promise<void> {
    const cacheFolderPath = join(opts.root, '.temp')
    const cacheFilePath = join(cacheFolderPath, 'shiny-config.json')
    if (!existsSync(cacheFolderPath)) await mkdir(cacheFolderPath)
    if (existsSync(cacheFilePath)) return
    // create a plugin array. This will be later merged back by dynamic importing all plugins
    const renamePlugins: string[] = opts.rename ? Object.keys(opts.rename) : []
    const values: string[] = opts.rename ? Object.values(opts.rename) : []
    const configCount = parsedProfiles.length
    const dataArray: CacheData[] = []
    let plugins: Record<string, ESLint.Plugin>
    let config: Linter.FlatConfig
    let finalPluginArray: string[] = []
    let cache: CacheData
    let langOpts: LanguageOptions | undefined
    for (let i = 0; i < configCount; i++) {
        cache = {}
        finalPluginArray = []
        config = parsedProfiles[i]
        plugins = config.plugins ?? {}
        for (const plugin of Object.keys(plugins)) {
            finalPluginArray.push(patchOrgaString(values.includes(plugin) ? findMatchingKey(opts.rename, renamePlugins, plugin) : plugin))
        }
        cache.plugins = finalPluginArray
        cache.rules = config.rules
        cache.files = config.files as string[]
        cache.ignores = config.ignores
        cache.settings = config.settings
        cache.linterOptions = config.linterOptions
        langOpts = config.languageOptions as LanguageOptions | undefined
        if (langOpts) {
            cache.languageOptions = Object.assign({}, langOpts as any)
            if (langOpts.parser) {
                cache.languageOptions!.parser = patchOrgaString(langOpts.parser.meta?.name ?? '')
                if (langOpts.parserOptions?.parser.meta) {
                    cache.languageOptions!.parserOptions!.parser = patchOrgaString(langOpts.parserOptions.parser.meta?.name ?? '')
                }
            }
        }
        if (config.processor) cache.processor = config.processor.meta?.name ?? ''
        dataArray.push(cache)
    }
    await writeFile(cacheFilePath, JSON.stringify({ data: dataArray }), 'utf8')
}
