import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Linter } from 'eslint'

import type { ImportedProfile, PartialProfileConfig, ShinyConfig } from 'src/types/interfaces'
import type { Profile } from 'src/types/types'
import isProfile from 'src/utils/isProfile'
import ensureArray from 'src/utils/ensureArray'
import mergeArr from 'src/utils/mergeArr'

import mergeConfig from './mergeConfig'

type FetchedProfileConfig = PartialProfileConfig | PartialProfileConfig[]

const ProfileMap = new Map<Profile, PartialProfileConfig>()

async function fetchConfig(c: Profile): Promise<FetchedProfileConfig> {
    if (ProfileMap.has(c)) return ProfileMap.get(c)!
    const fetchedConfig: ImportedProfile = await import(`file://${dirname(fileURLToPath(import.meta.url))}/profiles/${c}.js`)
    ProfileMap.set(c, fetchedConfig.config)
    // Safe the rules for FlatConfig extension overwrite
    // cacheRules(c, fetchedConfig.default)
    return fetchedConfig.default ?? fetchedConfig.config
}

function convertFlatConfig(c: Linter.FlatConfig): PartialProfileConfig {
    let languageOptions = {}
    if ((c as any).parserOptions) languageOptions = { parserOptions: (c as any).parserOptions }
    else if (c.languageOptions) languageOptions = c.languageOptions
    return {
        files: c.files,
        ignores: c.ignores,
        languageOptions,
        linterOptions: c.linterOptions,
        name: 'extended-file',
        plugins: c.plugins,
        processor: c.processor ? ensureArray(c.processor as Linter.Processor[]) : undefined,
        rules: ensureArray(c.rules as any),
        settings: c.settings
    }
}

async function handleExtends(
    extension: Linter.FlatConfig | Profile,
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
        extensionProfile = convertFlatConfig(extension)
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
    if (!fetchedConfigs.length) return []
    const resolvedConfigs: PartialProfileConfig[] = []
    // The length dynamically changes if a profile extends an array profile
    for (let i = 0; i < fetchedConfigs.length; i++) {
        resolvedConfigs.push(await getResolvedConfig(fetchedConfigs[i], fetchedConfigs))
    }
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
    return await resolveExtensions(fetchedConfigs.flat())
}
