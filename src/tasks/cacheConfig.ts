import type { FlatConfig, Processor, SharedConfig } from '@typescript-eslint/utils/ts-eslint'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { GlobalPJStore, JsonProcessor } from 'src/constants'
import type { CacheData, CacheOptions, LanguageOptions, ParseProfilesResult, ShinyConfig } from 'src/types/interfaces'
import { mergeArr, optimizeRules } from 'src/utils'

function invertRename(plugin: string, keys: string[], renameValues: string[], renames: Record<string, string>): string {
    if (!renameValues.includes(plugin)) return plugin
    for (const key of keys) if (renames[key] === plugin) return key
    return plugin
}

/**
 *  Fixes the organization part of a dependency name, e.g. @typescript-eslint or @react-eslint, for the cache data. This fix is needed for renamed
 *  plugins or malformed names, e.g. parser names like the TypeScript parser, to correctly persist the original name for the cache data to be applied.
 *
 * @param name - name of the plugin or parser
 * @param renames - list of renames that were previously applied
 * @returns the patched dependency name.
 */
function patchOrgaString(name: string, renames?: string[]): string {
    if (!name.includes('/') || name.includes('@')) return name
    if (name.includes('parser')) return `@${name}`
    if (!renames) return name
    const parts = name.split('/')
    const plugin = `${parts[0]}/`
    const len = renames.length
    let currentRename: string
    for (let i = 0; i < len; i++) {
        currentRename = renames[i]
        if (`${renames[i]}/`.includes(plugin)) return `${currentRename}/${parts[1]}`
    }
    return name
}

/**
 *  Merges all found cache options into a large cache options object as we treat the cache config as one entity.
 *
 *  @param options - cache options of each parsed profile
 *  @returns final cache options to persist.
 */
function mergeCacheOptions(options: (CacheOptions | undefined)[]): CacheOptions {
    // Copy the options here, so we can later apply the settings to it.
    const opts = [...options].filter(Boolean) as CacheOptions[]
    const length = opts.length
    const final: CacheOptions = { mapper: {} }
    for (let i = 0; i < length; i++) Object.assign(final.mapper, opts[i].mapper)
    return final
}

async function buildCacheFile(dataArray: CacheData[], parsedProfiles: ParseProfilesResult, opts: ShinyConfig): Promise<string> {
    const renames = opts.rename
    const trims = opts.trim
    let rules: SharedConfig.RulesRecord | undefined
    for (let i = dataArray.length - 1; i >= 0; i--) {
        rules = dataArray[i].rules
        if (!rules) continue
        optimizeRules(rules, renames, trims)
    }
    return JSON.stringify({
        version: (await GlobalPJStore.getCurrentPackage()).version,
        data: dataArray,
        config: mergeCacheOptions(parsedProfiles.cacheOpts)
    })
}

export default async function cacheConfig(opts: ShinyConfig, parsedProfiles: ParseProfilesResult): Promise<void> {
    const cacheFolderPath = join(opts.root, '.temp')
    const cacheFilePath = join(cacheFolderPath, 'shiny-config.json')
    // Is there a .temp folder for our config?
    if (!existsSync(cacheFolderPath)) await mkdir(cacheFolderPath)
    // Cache file already exist, don't create new one.
    if (existsSync(cacheFilePath)) return
    // create a plugin array. This will be later merged back by dynamic importing all plugins
    const renames = opts.rename
    const renamePlugins: string[] = renames ? Object.keys(renames) : []
    const renameValues: string[] = renames ? Object.values(renames) : []
    const configs = parsedProfiles.configs
    if (opts.externalConfigs) mergeArr(configs, opts.externalConfigs)
    const configCount = configs.length
    const dataArray: CacheData[] = []
    let plugins: FlatConfig.Plugins
    let config: FlatConfig.Config
    let finalPluginArray: string[] = []
    let cache: CacheData
    let langOpts: LanguageOptions | undefined
    // Cache every config iteratively
    for (let i = 0; i < configCount; i++) {
        cache = {}
        finalPluginArray = []
        config = configs[i]
        plugins = config.plugins ?? {}
        // Patch malformed organization dependency names
        for (let plugin of Object.keys(plugins)) {
            finalPluginArray.push(patchOrgaString(invertRename(plugin, renamePlugins, renameValues, renames), renamePlugins))
        }
        // Only add the dependency names used for the plugins.
        cache.plugins = finalPluginArray
        cache.rules = config.rules
        cache.files = config.files as string[]
        cache.ignores = config.ignores
        cache.settings = config.settings
        cache.linterOptions = config.linterOptions
        langOpts = config.languageOptions as LanguageOptions | undefined
        // Instead of persisting the entire parser (which is impossible in JSON), only fetch the name and potentially fix an orga dependency like
        // @typescript-eslint/parser
        if (langOpts) {
            cache.languageOptions = Object.assign({}, langOpts as any)
            if (langOpts.parser) {
                cache.languageOptions!.parser = patchOrgaString(langOpts.parser.meta?.name ?? '')
                // Yes, sometimes there can be two parsers in configs.
                if (langOpts.parserOptions?.parser?.meta) {
                    cache.languageOptions!.parserOptions!.parser = patchOrgaString(langOpts.parserOptions.parser.meta?.name ?? '')
                }
            }
        }
        // Same thing with processor.
        if (config.processor) {
            cache.processor =
                config.processor === JsonProcessor
                    ? JsonProcessor
                    : patchOrgaString((config.processor as Processor.LooseProcessorModule).meta?.name ?? '')
        }
        dataArray.push(cache)
    }
    await writeFile(cacheFilePath, await buildCacheFile(dataArray, parsedProfiles, opts), 'utf8')
}
