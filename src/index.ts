import type { Linter } from 'eslint'

import { applyPrettier, findTSConfigs, parseIgnoreFile } from './plugins'
import getConfigs from './tasks/getConfigs'
import parseProfiles from './tasks/parseProfiles'
import type { PartialProfileConfig, ShinyConfig } from './types/interfaces'
import { mergeConfig } from './tasks'
import hasBaseConfig from './guards/hasBaseConfig'
import ensureArray from './utils/ensureArray'
import patchVSCode from './plugins/patchVSCode'
import displayTask from './tasks/displayTask'
import cacheConfig from './tasks/cacheConfig'
import useCache from './tasks/useCache'
import hasCache from './guards/hasCache'

export { default as merge } from './utils/merge'
export { default as mergeArr } from './utils/mergeArr'

const defaults: ShinyConfig = {
    cache: true,
    configs: ['base'],
    ignoreFiles: ['.eslintignore, .gitignore'],
    patchVSCode: true,
    prettier: true,
    rename: {
        '@microsoft/sdl': 'sdl',
        '@typescript-eslint': 'ts'
    },
    root: process.cwd()
}

export default async function shiny(options: Partial<ShinyConfig>): Promise<Linter.FlatConfig[]> {
    const opts = Object.assign({}, defaults, options)
    opts.rename = Object.assign({}, defaults.rename, options.rename ?? {})
    const isEmpty = !opts.configs.length
    if (isEmpty && !opts.cache) return []
    const display = displayTask(opts)
    display.next()
    if (hasCache(opts)) {
        const config = await useCache(opts)
        display.next()
        return config
    }
    const hasBase = hasBaseConfig(opts)
    // 1. fetch all profiles and parse config files
    const plugins: Promise<PartialProfileConfig | PartialProfileConfig[]>[] = [getConfigs(opts), findTSConfigs(opts)]
    if (hasBase && opts.prettier) plugins.push(applyPrettier(opts))
    if (opts.ignoreFiles.length) {
        for (let i = opts.ignoreFiles.length - 1; i >= 0; i--) plugins.push(parseIgnoreFile(opts.root, opts.ignoreFiles[i]))
    }
    if (opts.patchVSCode) plugins.push(patchVSCode(opts) as any)
    const allProfiles: (PartialProfileConfig | PartialProfileConfig[])[] = await Promise.all(plugins)
    display.next()

    // 2. flatten the fetched profiles
    const profiles = allProfiles.shift() as PartialProfileConfig[]
    profiles.unshift(mergeConfig(profiles.shift()!, ...ensureArray(allProfiles)))
    display.next()
    // 3. Merge to the final config array
    const parsedProfiles = parseProfiles(opts, profiles, hasBase)
    // 4. Cache transformed config
    if (opts.cache) {
        display.next()
        await cacheConfig(opts, parsedProfiles)
    }
    display.next()
    return parsedProfiles
}
