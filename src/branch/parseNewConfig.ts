import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { DisplayManager } from 'src/handler'
import type { ProfileConfig, ProjectMetadata, ShinyConfig } from 'src/types'
import type { DeepPartial, MaybeArray } from 'typestar'
import { keysOf, mergeArr } from 'compresso'
import Promeister from 'promeister'
import { hasBaseConfig } from 'src/guards'
import { applyPrettier, getTSConfig, parseIgnoreFiles, patchVSCode } from 'src/plugins'
import { cacheConfig, getConfigs, mergeConfig, parseProfiles } from 'src/tasks'
import { config as strict } from '../profiles/util/strict'

const metadataPlugins: Record<string, (opts: ShinyConfig) => unknown> = {
  ignoreFiles: parseIgnoreFiles,
  tsconfig: getTSConfig
}

export default async function parseNewConfig(
  opts: ShinyConfig,
  display: DisplayManager<ShinyConfig>,
  metadata: ProjectMetadata
): Promise<FlatConfig.Config[]> {
  const hasBase = hasBaseConfig(opts)
  // 0. Apply Project Metadata plugins
  for (const key of keysOf(metadataPlugins)) {
    metadata[key] = await metadataPlugins[key](opts)
  }
  // 1. fetch all profiles
  const configs = await getConfigs(opts, metadata)
  // 2. Parse all profile plugins
  display.next()
  // 2.1. Run profile plugins
  const plugins: Promise<MaybeArray<DeepPartial<ProfileConfig>>>[] = []
  if (hasBase && opts.configs.includes('format') && opts.prettier) plugins.push(applyPrettier(opts))

  const profilePlugins = await Promeister.all(plugins)
  // Add strict config to forcefully enable or disable rules
  profilePlugins.push(strict(opts.strict))
  // 2.2 Run external plugins
  if (opts.patchVSCode) await patchVSCode(opts, display)
  // 3. Merge to the final config array
  display.next()
  let base = configs[0]
  for (const plugin of profilePlugins) base = mergeConfig(base, plugin as DeepPartial<ProfileConfig>, true)
  configs[0] = base
  const parsedProfiles = parseProfiles(opts, configs, hasBase)
  // 4. Cache transformed config
  if (opts.cache) {
    display.optional('caching')
    await cacheConfig(opts, parsedProfiles, metadata)
  }
  if (opts.externalConfigs && !opts.cache) mergeArr(parsedProfiles.configs, opts.externalConfigs)
  return parsedProfiles.configs
}
