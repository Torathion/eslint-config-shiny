import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ClassicConfig, FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { Linter } from 'eslint'
import type { ImportedProfile, LanguageOptions, PartialProfileConfig, ProjectMetadata, ShinyConfig } from 'src/types/interfaces'

import type { Profile } from 'src/types/types'
import type { MaybeArray } from 'typestar'

import { ensureArr, isArray, isString } from 'compresso'
import Promeister from 'promeister'

import isProfile from 'src/guards/isProfile'
import mergeConfig from './mergeConfig'

type FetchedProfileConfig = MaybeArray<PartialProfileConfig>
const ProfileMap = new Map<Profile, MaybeArray<PartialProfileConfig>>()
const folder = dirname(fileURLToPath(import.meta.url))

export default async function getConfigs(options: ShinyConfig, metadata: ProjectMetadata): Promise<PartialProfileConfig[]> {
    const configs = options.configs
    let len = configs.length
    // Fallback to 'empty' profile, if we don't have any profiles specified to fetch.
    if (!len) {
        configs.push('empty')
        len++
    }
    const fetchConfigPromises: Promise<FetchedProfileConfig>[] = new Array(len)
    // 1. Prepare parallel config loading
    for (let i = 0; i < len; i++) fetchConfigPromises[i] = fetchConfig(configs[i], metadata)
    // 2. Loading configs
    const fetchedConfigs = await Promeister.all(fetchConfigPromises)
    // 3. Resolve extensions
    return resolveExtensions(fetchedConfigs.flat(), metadata)
}

async function fetchConfig(c: Profile, metadata: ProjectMetadata): Promise<FetchedProfileConfig> {
    if (ProfileMap.has(c)) return ProfileMap.get(c)!
    try {
        const fetchedConfig: ImportedProfile = await import(`file://${folder}/profiles/${c}.js`)
        const config = fetchedConfig.default(metadata)
        ProfileMap.set(c, config)
        return config
    } catch {
        throw new Error(`Unknown profile "${c}". Please make sure to only use known profiles.`)
    }
}

async function getResolvedConfig(
    config: PartialProfileConfig,
    allConfigs: PartialProfileConfig[],
    metadata: ProjectMetadata
): Promise<PartialProfileConfig> {
    if (!config.extends) return config
    let mergedConfig = config
    let extensionProfile: MaybeArray<PartialProfileConfig> | undefined
    for (let extensions = config.extends.length, i = 0; i < extensions; i++) {
        extensionProfile = await handleExtends(config.extends[i], allConfigs, metadata)
        if (!extensionProfile) continue

        // recursively extend
        if (isArray(extensionProfile)) {
            for (const profile of extensionProfile) {
                mergedConfig = mergeConfig(profile.extends ? await getResolvedConfig(profile, allConfigs, metadata) : profile, mergedConfig)
            }
        } else {
            if (extensionProfile.extends) extensionProfile = await getResolvedConfig(extensionProfile, allConfigs, metadata)
            mergedConfig = mergeConfig(extensionProfile, mergedConfig)
        }
        extensionProfile = undefined
    }
    return mergedConfig
}

async function handleExtends(
    extension: FlatConfig.Config | Profile | ClassicConfig.Config,
    fetchedConfigs: PartialProfileConfig[],
    metadata: ProjectMetadata
): Promise<MaybeArray<PartialProfileConfig> | undefined> {
    let extensionProfile: MaybeArray<PartialProfileConfig> | undefined
    if (isString(extension) && isProfile(extension)) {
        extensionProfile = ProfileMap.has(extension) ? ProfileMap.get(extension)! : (await fetchConfig(extension, metadata))
        // Convert the flat config to an internally formatted profile for faster merging
    } else {
        extensionProfile = normalizeExternalConfig(extension as FlatConfig.Config)
    }
    return extensionProfile
}

function normalizeExternalConfig(c: FlatConfig.Config): PartialProfileConfig {
    let languageOptions: Partial<LanguageOptions> = {}
    if ((c as any).parserOptions) languageOptions = { parserOptions: (c as any).parserOptions }
    else if (c.languageOptions) {
        languageOptions = c.languageOptions!
        languageOptions.globals = ensureArr(c.languageOptions.globals as any)
    }
    return {
        files: c.files?.flat(),
        ignores: c.ignores,
        languageOptions,
        linterOptions: c.linterOptions,
        name: 'extended-file',
        plugins: c.plugins ?? {},
        processor: ensureArr(c.processor as Linter.Processor[]),
        rules: ensureArr(c.rules as any),
        settings: c.settings
    }
}

async function resolveExtensions(fetchedConfigs: PartialProfileConfig[], metadata: ProjectMetadata): Promise<PartialProfileConfig[]> {
    const len = fetchedConfigs.length
    if (!len) return []
    const resolvedConfigs: PartialProfileConfig[] = []
    // The length dynamically changes if a profile extends an array profile
    for (const config of fetchedConfigs) resolvedConfigs.push(await getResolvedConfig(config, fetchedConfigs, metadata))

    return resolvedConfigs
}
