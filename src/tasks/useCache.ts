import { open } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { ESLint } from 'eslint'
import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { Cache, CacheData, CacheOptions, ShinyConfig } from 'src/types/interfaces'
import mergeProcessors from './mergeProcessors'
import { cwd, GlobalPJStore, JsonProcessor } from 'src/constants'
import { fileToJson } from 'src/utils'

const pluginPrefix = `eslint-plugin-`

async function load(module: string): Promise<any> {
    const deps = (await GlobalPJStore.getCurrentPackage()).dependencies
    // Fetch from own dependencies
    if (deps.includes(module)) return (await import(module)).default
    // Fetch from user project dependencies
    const entry = (await GlobalPJStore.getModule(module)).entryFile
    try {
        return (await import(pathToFileURL(join(`${cwd}`, 'node_modules', module, entry)).href)).default
    } catch {
        throw new Error(`Could not find package ${module}`)
    }
}

/**
 *  Resolves the names of the plugins to import.
 *
 *  @param plugin - cached name of the plugin.
 *  @param cacheOptions - options from the cached config data.
 *  @returns the plugin name to import.
 */
function resolvePluginName(plugin: string, cacheOptions: CacheOptions): string {
    if (cacheOptions.mapper?.[plugin]) return cacheOptions.mapper[plugin]
    if (plugin.includes('@')) {
        const index = plugin.indexOf('/')
        if (index > 0) return `${plugin.substring(0, index)}/${pluginPrefix}${plugin.substring(index + 1)}`
        return `${plugin}/eslint-plugin`
    }
    return `${pluginPrefix}${plugin}`
}

async function resolvePlugins(config: CacheData, cacheOptions: CacheOptions): Promise<void> {
    if (!config.plugins?.length) return
    const length = config.plugins.length
    const promises: Promise<any>[] = new Array(length)
    for (let i = 0; i < length; i++) promises[i] = load(resolvePluginName(config.plugins[i], cacheOptions))
    const fetchedPlugins = await Promise.all(promises)
    const pluginMap: Record<string, ESLint.Plugin> = {}
    for (let i = 0; i < length; i++) pluginMap[config.plugins[i]] = fetchedPlugins[i]
    config.plugins = pluginMap as any
}

async function resolveParser(config: CacheData): Promise<void> {
    if (!config.languageOptions) return
    const langOpts = config.languageOptions
    const langParser = langOpts.parser
    if (langParser) langOpts.parser = await load(langParser)
    const parserParser = langOpts.parserOptions?.parser
    if (parserParser) langOpts.parserOptions!.parser = await load(parserParser)
}

function handleProcessors(cachedProcessors: any[]): FlatConfig.Processor[] {
    const length = cachedProcessors.length
    const handledProcessors: FlatConfig.Processor[] = []
    let cachedProcessor
    for (let i = 0; i < length; i++) {
        cachedProcessor = cachedProcessors[i]
        // assume it's the eslint-processor-vue-blocks
        if (typeof cachedProcessor === 'function') {
            handledProcessors.push(
                cachedProcessor({
                    blocks: {
                        customBlocks: true,
                        script: false,
                        styles: true,
                        template: false
                    }
                })
            )
        } else handledProcessors.push(cachedProcessor)
    }
    return handledProcessors
}

async function processorResolver(p: string): Promise<FlatConfig.Processor> {
    if (p === JsonProcessor) return p as FlatConfig.Processor
    return await load(p)
}

async function resolveProcessor(config: CacheData): Promise<void> {
    const configProcessor = config.processor
    if (!configProcessor) return
    const processors: string[] = configProcessor.includes('merged-processor')
        ? configProcessor.substring(configProcessor.indexOf(':') + 1).split('+')
        : [configProcessor]
    // check for vue processor. It's the first one in the predefined config
    const parsedProcessors: FlatConfig.Processor[] = []
    if (processors[0] === 'eslint-plugin-vue') {
        parsedProcessors.push((await load(processors[0])).processors['.vue'])
        processors.shift()
    }
    parsedProcessors.push(...(await Promise.all(processors.map(processorResolver))))
    config.processor = parsedProcessors.length === 1 ? parsedProcessors[0] : (mergeProcessors(handleProcessors(parsedProcessors)) as any)
}

export default async function useCache(opts: ShinyConfig): Promise<FlatConfig.Config[]> {
    const cacheFilePath = join(join(opts.root, '.temp'), 'shiny-config.json')
    const configArray: FlatConfig.Config[] = []
    const file = await open(cacheFilePath, 'r')
    const cache: Cache = await fileToJson(file)
    const data = cache.data
    const cacheOptions = cache.config
    const length = data.length
    let config: CacheData
    for (let i = 0; i < length; i++) {
        config = data[i]
        await Promise.all([resolvePlugins(config, cacheOptions), resolveParser(config), resolveProcessor(config)])
        configArray.push(config as FlatConfig.Config)
    }
    await file.close()
    return configArray
}
