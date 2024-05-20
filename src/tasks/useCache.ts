import type { ESLint, Linter } from 'eslint'
import { open } from 'node:fs/promises'
import { join } from 'node:path'
import type { CacheData, ShinyConfig } from 'src/types/interfaces'
import fileToJson from 'src/utils/fileToJson'
import mergeProcessors from './mergeProcessors'
import renamePlugins from 'src/utils/renamePlugins'

const pluginPrefix = `eslint-plugin-`

const cache = new Map<string, unknown>()

async function load(module: string): Promise<any> {
    if (cache.has(module)) return cache.get(module)!
    const defaultModule = (await import(module)).default
    cache.set(module, defaultModule)
    return defaultModule
}

function resolvePluginName(plugin: string): string {
    if (plugin.includes('@')) {
        const index = plugin.indexOf('/')
        if (index > 0) return `${plugin.substring(0, index)}/${pluginPrefix}${plugin.substring(index + 1)}`
        return `${plugin}/eslint-plugin`
    }
    return `${pluginPrefix}${plugin}`
}

async function resolvePlugins(config: CacheData): Promise<void> {
    if (!config.plugins?.length) return
    const length = config.plugins.length
    const promises: Promise<any>[] = new Array(length)

    let currentPlugin: string, hasEslintReact
    for (let i = 0; i < length; i++) {
        currentPlugin = config.plugins[i]
        // Skip eslint-react sub plugins until @eslint-react 2.0.0
        if (currentPlugin.includes('@eslint-react/')) {
            hasEslintReact = true
            continue
        }
        promises[i] = load(resolvePluginName(currentPlugin))
    }
    const fetchedPlugins = await Promise.all(promises)
    const pluginMap: Record<string, ESLint.Plugin> = {}
    for (let i = 0; i < length; i++) {
        pluginMap[config.plugins[i]] = fetchedPlugins[i]
    }
    // Temporary workaround until @eslint-react 2.0.0
    if (hasEslintReact) {
        const eslintReact = pluginMap['@eslint-react']
        const plugins = eslintReact.configs!.all.plugins!
        pluginMap['@eslint-react/dom'] = plugins['@eslint-react/dom']
        pluginMap['@eslint-react/hooks-extra'] = plugins['@eslint-react/hooks-extra']
        pluginMap['@eslint-react/naming-convention'] = plugins['@eslint-react/naming-convention']
    }
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

function handleProcessors(cachedProcessors: any[]): Linter.Processor[] {
    const length = cachedProcessors.length
    const handledProcessors: Linter.Processor[] = []
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

async function resolveProcessor(config: CacheData): Promise<void> {
    const configProcessor = config.processor
    if (!configProcessor) return
    const processors: string[] = configProcessor.includes('merged-processor')
        ? configProcessor.substring(configProcessor.indexOf(':') + 1).split('+')
        : [configProcessor]
    // check for vue processor. It's the first one in the predefined config
    const parsedProcessors = []
    if (processors[0] === 'eslint-plugin-vue') {
        parsedProcessors.push((await load(processors[0])).processors['.vue'])
        processors.shift()
    }
    parsedProcessors.push(...(await Promise.all(processors.map(async p => load(p)))))
    config.processor = parsedProcessors.length === 1 ? parsedProcessors[0] : (mergeProcessors(handleProcessors(parsedProcessors)) as any)
}

export default async function useCache(opts: ShinyConfig): Promise<Linter.FlatConfig[]> {
    const cacheFilePath = join(join(opts.root, '.temp'), 'shiny-config.json')
    const configArray: Linter.FlatConfig[] = []
    const file = await open(cacheFilePath, 'r')
    const data = (await fileToJson(file)).data
    const length = data.length
    let config: CacheData
    for (let i = 0; i < length; i++) {
        config = data[i]
        await Promise.all([resolvePlugins(config), resolveParser(config), resolveProcessor(config)])
        config.plugins = renamePlugins(config.plugins, opts.rename)
        configArray.push(config)
    }
    await file.close()
    return configArray
}
