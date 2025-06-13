import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { ESLint } from 'eslint'
import type { Cache, CacheData, CacheOptions } from 'src/types/interfaces'
import { isFunction, mergeArr } from 'compresso'
import Promeister from 'promeister'
import { cwd, GlobalPJStore, JsonProcessor } from 'src/constants'
import mergeProcessors from './mergeProcessors'

const pluginPrefix = 'eslint-plugin-'

export default async function useCache(cache: Cache): Promise<FlatConfig.Config[]> {
  const configArray: FlatConfig.Config[] = []
  const data = cache.data
  const cacheOptions = cache.config
  const length = data.length
  let config: CacheData
  for (let i = 0; i < length; i++) {
    config = data[i]
    await Promeister.all([resolvePlugins(config, cacheOptions), resolveParser(config), resolveProcessor(config)])
    configArray.push(config as FlatConfig.Config)
  }
  return configArray
}

function handleProcessors(cachedProcessors: (FlatConfig.Processor | Function)[]): FlatConfig.Processor[] {
  const length = cachedProcessors.length
  const handledProcessors: FlatConfig.Processor[] = []
  let cachedProcessor
  for (let i = 0; i < length; i++) {
    cachedProcessor = cachedProcessors[i]
    // assume it's the eslint-processor-vue-blocks
    if (isFunction(cachedProcessor)) {
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
    } else handledProcessors.push(cachedProcessor as FlatConfig.Processor)
  }
  return handledProcessors
}

async function load(module: string): Promise<any> {
  const deps = (await GlobalPJStore.getCurrentPackage()).dependencies
  // Fetch from own dependencies
  if (deps.includes(module)) return (await import(module)).default
  // Fetch from user project dependencies
  const entry = (await GlobalPJStore.getModule(module)).entryFile
  try {
    return (await import(pathToFileURL(join(cwd, 'node_modules', module, entry)).href)).default
  } catch {
    throw new Error(`Could not find package ${module}`)
  }
}

async function processorResolver(p: string): Promise<FlatConfig.Processor> {
  if (p === JsonProcessor) return p as FlatConfig.Processor
  return await load(p)
}

async function resolveParser(config: CacheData): Promise<void> {
  if (!config.languageOptions) return
  const langOpts = config.languageOptions
  const langParser = langOpts.parser
  if (langParser) langOpts.parser = await load(langParser)
  const parserParser = langOpts.parserOptions?.parser
  if (parserParser) langOpts.parserOptions!.parser = await load(parserParser)
}

/**
 *  Resolves the names of the plugins to import.
 *
 *  @param plugin - cached name of the plugin.
 *  @param cacheOptions - options from the cached config data.
 *  @returns the plugin name to import.
 */
function resolvePluginName(plugin: string, cacheOptions: CacheOptions): string {
  if (cacheOptions.mapper[plugin]) return cacheOptions.mapper[plugin]
  if (plugin.includes('@')) {
    const index = plugin.indexOf('/')
    if (index > 0) return `${plugin.substring(0, index)}/${pluginPrefix}${plugin.substring(index + 1)}`
    return `${plugin}/eslint-plugin`
  }
  return `${pluginPrefix}${plugin}`
}

async function resolvePlugins(config: CacheData, cacheOptions: CacheOptions): Promise<void> {
  const pluginMap: Record<string, ESLint.Plugin> = {}
  if (config.plugins?.length) {
    const length = config.plugins.length
    const promises: Promise<any>[] = new Array(length)
    for (let i = 0; i < length; i++) promises[i] = load(resolvePluginName(config.plugins[i], cacheOptions))
    const fetchedPlugins = await Promeister.all(promises)
    for (let i = 0; i < length; i++) pluginMap[config.plugins[i]] = fetchedPlugins[i]
  }
  config.plugins = pluginMap as any
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
    parsedProcessors.push((await load(processors[0])).processors['.vue'] as FlatConfig.Processor)
    processors.shift()
  }
  mergeArr(parsedProcessors, await Promeister.all(processors.map(processorResolver)))
  config.processor = parsedProcessors.length === 1 ? parsedProcessors[0] : (mergeProcessors(handleProcessors(parsedProcessors)) as any)
}
