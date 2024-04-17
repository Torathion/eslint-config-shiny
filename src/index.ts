import type { Linter } from 'eslint'

import { applyPrettier, findTSConfigs, parseGitignore } from './plugins'
import getConfigs from './tasks/getConfigs'
import parseProfiles from './tasks/parseProfiles'
import type { PartialProfileConfig, ShinyConfig } from './types/interfaces'
import { mergeConfig } from './tasks'
import hasBaseConfig from './utils/hasBaseConfig'
import ensureArray from './utils/ensureArray'

export { default as merge } from './utils/merge'
export { default as mergeArr } from './utils/mergeArr'

const defaults: ShinyConfig = {
    configs: ['base'],
    eslintignore: true,
    gitignore: true,
    prettier: true
}

// TODO: Fix parser, fix processor, look through auto-fixable standard eslint rules
export default async function shiny(options: Partial<ShinyConfig>): Promise<Linter.FlatConfig[]> {
    const opts = Object.assign({}, defaults, options)
    if (!opts.configs.length) return []
    const hasBase = hasBaseConfig(opts)
    // 1. fetch all profiles and parse config files
    const plugins: Promise<PartialProfileConfig | PartialProfileConfig[]>[] = [getConfigs(opts), findTSConfigs()]
    if (hasBase && opts.prettier) plugins.push(applyPrettier())
    if (opts.gitignore) plugins.push(parseGitignore())
    const allProfiles: (PartialProfileConfig | PartialProfileConfig[])[] = await Promise.all(plugins)
    // 2. flatten the fetched profiles
    const profiles = allProfiles.shift() as PartialProfileConfig[]
    profiles.unshift(mergeConfig(profiles.shift()!, ...ensureArray(allProfiles)))
    // 3. Merge to the final config array
    return parseProfiles(profiles, hasBase)
}
