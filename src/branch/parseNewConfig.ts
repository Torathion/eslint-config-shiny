import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { DisplayManager } from 'src/handler'
import type { PartialProfileConfig, ProjectMetadata, ShinyConfig } from 'src/types'
import type { MaybeArray } from 'typestar'
import CancelablePromise from 'src/classes/CancelablePromise'
import { hasBaseConfig } from 'src/guards'
import { applyPrettier, findTSConfigs, parseIgnoreFiles, patchVSCode, updateBrowserslist } from 'src/plugins'
import { cacheConfig, getConfigs, mergeConfig, parseProfiles } from 'src/tasks'
import { mergeArr } from 'src/utils'
import { config as strict } from '../profiles/util/strict'

export default async function parseNewConfig(
    opts: ShinyConfig,
    display: DisplayManager<ShinyConfig>,
    metadata: ProjectMetadata
): Promise<FlatConfig.Config[]> {
    const hasBase = hasBaseConfig(opts)
    // 1. fetch all profiles
    const configs = await getConfigs(opts)
    // 2. Parse all profile plugins
    display.next()
    // 2.1. Run profile plugins
    const plugins: Promise<MaybeArray<PartialProfileConfig>>[] = [findTSConfigs(opts)]
    if (hasBase && opts.configs.includes('format') && opts.prettier) plugins.push(applyPrettier(opts))
    if (opts.ignoreFiles.length) plugins.push(parseIgnoreFiles(opts.ignoreFiles, opts.root))
    const profilePlugins = await CancelablePromise.all(plugins)
    profilePlugins.push(strict(opts.strict))
    // 2.2 Run external plugins
    if (opts.patchVSCode) await patchVSCode(opts, display)
    if (opts.updateBrowsersList) await updateBrowserslist(display)
    // 3. Merge to the final config array
    display.next()
    let base = configs[0]
    for (const plugin of profilePlugins) base = mergeConfig(base, plugin as PartialProfileConfig, true)
    configs[0] = base
    const parsedProfiles = parseProfiles(opts, configs, hasBase)
    // 4. Cache transformed config
    if (opts.cache) {
        display.optional('caching')
        await cacheConfig(opts, parsedProfiles, metadata)
    }
    return opts.externalConfigs && !opts.cache ? mergeArr(parsedProfiles.configs, opts.externalConfigs) : parsedProfiles.configs
}
