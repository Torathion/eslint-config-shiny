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

export { default as merge } from './utils/merge'
export { default as mergeArr } from './utils/mergeArr'

const defaults: ShinyConfig = {
    configs: ['base'],
    ignoreFiles: ['.eslintignore, .gitignore'],
    patchVSCode: true,
    prettier: true,
    rename: {
        '@typescript-eslint': 'ts',
        '@microsoft/sdl': 'sdl'
    }
}

export default async function shiny(options: Partial<ShinyConfig>): Promise<Linter.FlatConfig[]> {
    const opts = Object.assign({}, defaults, options)
    opts.rename = Object.assign({}, defaults.rename, options.rename ?? {})
    if (!opts.configs.length) return []
    const display = displayTask()
    display.next()
    const hasBase = hasBaseConfig(opts)
    // 1. fetch all profiles and parse config files
    const plugins: Promise<PartialProfileConfig | PartialProfileConfig[]>[] = [getConfigs(opts), findTSConfigs()]
    if (hasBase && opts.prettier) plugins.push(applyPrettier())
    if (opts.ignoreFiles.length) {
        for (let i = opts.ignoreFiles.length - 1; i >= 0; i--) plugins.push(parseIgnoreFile(opts.ignoreFiles[i]))
    }
    if (opts.patchVSCode) plugins.push(patchVSCode() as any)
    const allProfiles: (PartialProfileConfig | PartialProfileConfig[])[] = await Promise.all(plugins)
    display.next()

    // 2. flatten the fetched profiles
    const profiles = allProfiles.shift() as PartialProfileConfig[]
    profiles.unshift(mergeConfig(profiles.shift()!, ...ensureArray(allProfiles)))
    display.next()
    // 3. Merge to the final config array
    const parsedProfiles = parseProfiles(opts, profiles, hasBase)
    display.next()
    return parsedProfiles
}
