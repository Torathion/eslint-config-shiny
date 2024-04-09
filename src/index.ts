import type { Linter } from 'eslint'
import { applyPrettier, findTSConfigs, parseGitignore } from './plugins'
import getConfigs from './tasks/getConfigs'
import parseProfiles from './tasks/parseProfiles'
import type { PartialProfileConfig, ShinyConfig } from './types/interfaces'
import { mergeConfig } from './tasks'

export { default as merge } from './utils/merge'
export { default as mergeArr } from './utils/mergeArr'

export * from './constants'
export * from './globs'
export * from './lists'
export * from './plugins'
export * from './tasks'
export * from './types'

const defaults: ShinyConfig = {
    configs: ['base'],
    prettier: true,
    gitignore: true,
    eslintignore: true
}

export default async function shiny(options: Partial<ShinyConfig>): Promise<Linter.FlatConfig[]> {
    const opts = Object.assign({}, defaults, options)
    if (!opts.configs.length) return []
    // 1. fetch all profiles and parse config files
    const plugins: Promise<PartialProfileConfig | PartialProfileConfig[]>[] = [getConfigs(opts), findTSConfigs()]
    if (opts.prettier) plugins.push(applyPrettier())
    if (opts.gitignore) plugins.push(parseGitignore())
    const allProfiles: (PartialProfileConfig | PartialProfileConfig[])[] = await Promise.all(plugins)
    // 2. flatten the fetched profiles
    const profiles = allProfiles.shift() as PartialProfileConfig[]
    profiles.unshift(mergeConfig(profiles.shift()!, ...(allProfiles as PartialProfileConfig[])))
    // 3. Merge to the final config array
    return parseProfiles(profiles)
}
