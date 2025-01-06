import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { Linter } from 'eslint'
import type { ImportedProfile, LanguageOptions, PartialProfileConfig, ShinyConfig } from 'src/types/interfaces'

import type { Profile } from 'src/types/types'
import type { MaybeArray } from 'typestar'

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import isProfile from 'src/guards/isProfile'
import ensureArray from 'src/utils/ensureArray'
import mergeArr from 'src/utils/mergeArr'

import mergeConfig from './mergeConfig'

type FetchedProfileConfig = MaybeArray<PartialProfileConfig>

const ProfileMap = new Map<Profile, PartialProfileConfig>()

async function fetchConfig(c: Profile): Promise<FetchedProfileConfig> {
    if (ProfileMap.has(c)) return ProfileMap.get(c)!
    try {
        const fetchedConfig: ImportedProfile = await import(`file://${dirname(fileURLToPath(import.meta.url))}/profiles/${c}.js`)
        ProfileMap.set(c, fetchedConfig.config)
        return fetchedConfig.default ?? fetchedConfig.config
    } catch {
        throw new Error(`Unknown profile "${c}". Please make sure to only use known profiles.`)
    }
}

function normalizeExternalConfig(c: FlatConfig.Config): PartialProfileConfig {
    let languageOptions: Partial<LanguageOptions> = {}
    if ((c as any).parserOptions) languageOptions = { parserOptions: (c as any).parserOptions }
    else if (c.languageOptions) {
        languageOptions = c.languageOptions!
        languageOptions.globals = ensureArray(c.languageOptions.globals as any)
    }
    return {
        files: c.files,
        ignores: c.ignores,
        languageOptions,
        linterOptions: c.linterOptions,
        name: 'extended-file',
        plugins: c.plugins ?? {},
        processor: ensureArray(c.processor as Linter.Processor[]),
        rules: ensureArray(c.rules as any),
        settings: c.settings
    }
}

async function handleExtends(
    extension: FlatConfig.Config | Profile,
    fetchedConfigs: PartialProfileConfig[]
): Promise<PartialProfileConfig | undefined> {
    let extensionProfile: PartialProfileConfig | undefined
    if (typeof extension === 'string' && isProfile(extension)) {
        if (ProfileMap.has(extension)) extensionProfile = ProfileMap.get(extension)!
        else {
            const fetchedConfig = await fetchConfig(extension)
            // We found some new separate config objects!
            if (Array.isArray(fetchedConfig)) {
                extensionProfile = fetchedConfig.shift()
                mergeArr(fetchedConfigs, fetchedConfig)
            } else extensionProfile = fetchedConfig
        }
        // Convert the flat config to an internally formatted profile for faster merging
    } else if (typeof extension !== 'string') {
        extensionProfile = normalizeExternalConfig(extension)
    }
    return extensionProfile
}

async function getResolvedConfig(config: PartialProfileConfig, allConfigs: PartialProfileConfig[]): Promise<PartialProfileConfig> {
    if (!config.extends) return config
    const extensions = config.extends.length
    let mergedConfig = config
    let extensionProfile: PartialProfileConfig | undefined
    for (let i = 0; i < extensions; i++) {
        extensionProfile = await handleExtends(config.extends[i], allConfigs)
        if (!extensionProfile) continue
        // recursively extend
        if (extensionProfile.extends) extensionProfile = await getResolvedConfig(extensionProfile, allConfigs)
        mergedConfig = mergeConfig(extensionProfile, mergedConfig)
        extensionProfile = undefined
    }
    return mergedConfig
}

async function resolveExtensions(fetchedConfigs: PartialProfileConfig[]): Promise<PartialProfileConfig[]> {
    const len = fetchedConfigs.length
    if (!len) return []
    const resolvedConfigs: PartialProfileConfig[] = []
    // The length dynamically changes if a profile extends an array profile
    for (const config of fetchedConfigs) resolvedConfigs.push(await getResolvedConfig(config, fetchedConfigs))

    return resolvedConfigs
}

export default async function getConfigs(options: ShinyConfig): Promise<PartialProfileConfig[]> {
    const configs = options.configs
    const len = configs.length
    const fetchConfigPromises = new Array(len)
    // 1. Prepare parallel config loading
    for (let i = 0; i < len; i++) fetchConfigPromises[i] = fetchConfig(configs[i])
    // 2. Loading configs
    const fetchedConfigs = await Promise.all(fetchConfigPromises)
    // 3. Resolve extensions
    return resolveExtensions(fetchedConfigs.flat())
}
