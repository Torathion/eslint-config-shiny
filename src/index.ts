import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import { applyPrettier, findTSConfigs, parseIgnoreFile, patchVSCode, updateBrowserslist } from './plugins'
import type { PartialProfileConfig, ShinyConfig } from './types/interfaces'
import { cacheConfig, getConfigs, mergeConfig, optimizeConfig, parseProfiles, useCache } from './tasks'
import type { MaybeArray } from './types/types'
import DisplayTaskHandler from './handler/DisplayTaskHandler'
import { hasCache, hasBaseConfig } from './guards'

export { default as merge } from './utils/merge'
export { default as mergeArr } from './utils/mergeArr'

const defaults: ShinyConfig = {
    cache: true,
    configs: ['base'],
    ignoreFiles: ['.gitignore'],
    indent: false,
    patchVSCode: true,
    prettier: true,
    rename: {
        '@arthurgeron/react-usememo': 'use-memo',
        '@eslint-react': 'react',
        '@microsoft/sdl': 'sdl',
        '@stylistic/js': 'styleJs',
        '@stylistic/jsx': 'styleJsx',
        '@stylistic/ts': 'styleTs',
        '@typescript-eslint': 'ts'
    },
    root: process.cwd(),
    updateBrowsersList: false
}

export default async function shiny(options: Partial<ShinyConfig>): Promise<FlatConfig.Config[]> {
    const opts = Object.assign({}, defaults, options)
    opts.rename = Object.assign({}, defaults.rename, options.rename ?? {})
    const isEmpty = !opts.configs.length
    if (isEmpty && !opts.cache) return []

    const display = new DisplayTaskHandler(opts)
    const isCached = hasCache(opts)
    display.start()
    let configs: FlatConfig.Config[]
    if (isCached) configs = await useCache(opts)
    else {
        const hasBase = hasBaseConfig(opts)
        // 1. fetch all profiles and parse config files
        const plugins: Promise<MaybeArray<PartialProfileConfig>>[] = [getConfigs(opts), findTSConfigs(opts)]
        if (hasBase && opts.prettier) plugins.push(applyPrettier(opts))
        if (opts.ignoreFiles.length) {
            for (let i = opts.ignoreFiles.length - 1; i >= 0; i--) plugins.push(parseIgnoreFile(opts.root, opts.ignoreFiles[i]))
        }
        const allProfiles = await Promise.all(plugins)
        display.next()
        // 2. flatten the fetched profiles
        const profiles = allProfiles.shift() as PartialProfileConfig[] // the first element is always getConfigs
        let base = profiles.shift()!
        for (const plugin of allProfiles) base = mergeConfig(base, plugin as PartialProfileConfig, true)
        profiles.unshift(base)
        if (opts.patchVSCode) await patchVSCode(opts, display)
        if (opts.updateBrowsersList) await updateBrowserslist(display)
        display.next()
        // 3. Merge to the final config array
        const parsedProfiles = parseProfiles(opts, profiles, hasBase)
        // 4. Cache transformed config
        if (opts.cache) {
            display.next()
            await cacheConfig(opts, parsedProfiles)
        }
        configs = parsedProfiles.configs
    }
    // 5. Optimize config
    display.next()
    optimizeConfig(configs, opts, isCached)
    display.finish()
    return configs
}
