import type { Linter } from 'eslint'

import { applyPrettier, findTSConfigs, parseIgnoreFile, updateBrowsersList } from './plugins'
import getConfigs from './tasks/getConfigs'
import parseProfiles from './tasks/parseProfiles'
import type { PartialProfileConfig, ShinyConfig } from './types/interfaces'
import { mergeConfig } from './tasks'
import hasBaseConfig from './guards/hasBaseConfig'
import patchVSCode from './plugins/patchVSCode'
import cacheConfig from './tasks/cacheConfig'
import useCache from './tasks/useCache'
import hasCache from './guards/hasCache'
import type { MaybeArray } from './types/types'
import DisplayTaskHandler from './handler/DisplayTaskHandler'

export { default as merge } from './utils/merge'
export { default as mergeArr } from './utils/mergeArr'

const defaults: ShinyConfig = {
    cache: true,
    configs: ['base'],
    ignoreFiles: ['.eslintignore', '.gitignore'],
    indent: false,
    updateBrowsersList: false,
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
    root: process.cwd()
}

export default async function shiny(options: Partial<ShinyConfig>): Promise<Linter.FlatConfig[]> {
    const opts = Object.assign({}, defaults, options)
    opts.rename = Object.assign({}, defaults.rename, options.rename ?? {})
    const isEmpty = !opts.configs.length
    if (isEmpty && !opts.cache) return []
    const display = new DisplayTaskHandler(opts)
    display.start()
    if (hasCache(opts)) {
        const config = await useCache(opts)
        display.next()
        return config
    }
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
    if (opts.updateBrowsersList) await updateBrowsersList(display)
    display.next()
    // 3. Merge to the final config array
    const parsedProfiles = parseProfiles(opts, profiles, hasBase)
    // 4. Cache transformed config
    if (opts.cache) {
        display.next()
        await cacheConfig(opts, parsedProfiles)
    }
    display.finish()
    return parsedProfiles
}
