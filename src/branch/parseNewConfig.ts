import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { MaybeArray } from 'typestar'
import type { DisplayTaskHandler } from 'src/handler'
import type { PartialProfileConfig, ShinyConfig } from 'src/types'
import { hasBaseConfig } from 'src/guards'
import { applyPrettier, findTSConfigs, parseIgnoreFiles, patchVSCode, updateBrowserslist } from 'src/plugins'
import { cacheConfig, getConfigs, mergeConfig, parseProfiles } from 'src/tasks'
import { mergeArr } from 'src/utils'

export default async function parseNewConfig(opts: ShinyConfig, display: DisplayTaskHandler): Promise<FlatConfig.Config[]> {
    const hasBase = hasBaseConfig(opts)
    // 1. fetch all profiles and parse config files
    const plugins: Promise<MaybeArray<PartialProfileConfig>>[] = [getConfigs(opts), findTSConfigs(opts)]
    if (hasBase && opts.prettier) plugins.push(applyPrettier(opts))
    if (opts.ignoreFiles.length) plugins.push(parseIgnoreFiles(opts.ignoreFiles, opts.root))
    const allProfiles = await Promise.all(plugins)
    // 2. flatten the fetched profiles
    display.next()
    const profiles = allProfiles.shift() as PartialProfileConfig[] // the first element is always getConfigs
    let base = profiles.shift()!
    for (const plugin of allProfiles) base = mergeConfig(base, plugin as PartialProfileConfig, true)
    profiles.unshift(base)
    if (opts.patchVSCode) await patchVSCode(opts, display)
    if (opts.updateBrowsersList) await updateBrowserslist(opts, display)
    // 3. Merge to the final config array
    display.next()
    const parsedProfiles = parseProfiles(opts, profiles, hasBase)
    // 4. Cache transformed config
    if (opts.cache) {
        display.optional('caching', opts)
        await cacheConfig(opts, parsedProfiles)
    }
    return opts.externalConfigs && !opts.cache ? mergeArr(parsedProfiles.configs, opts.externalConfigs) : parsedProfiles.configs
}
