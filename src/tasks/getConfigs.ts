import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Linter } from 'eslint'
import type { ProfileConfig, ShinyConfig } from 'src/types/interfaces'
import type { Profile } from 'src/types/types'
import mergeArr from 'src/utils/mergeArr'

type FetchedProfileConfig = Partial<ProfileConfig> | Partial<ProfileConfig>[]
type FetchedConfig = FetchedProfileConfig | Linter.FlatConfig

async function fetchConfig(c: Profile): Promise<FetchedConfig[]> {
    const fetchedConfig: FetchedProfileConfig = (await import(`file://${dirname(fileURLToPath(import.meta.url))}/profiles/${c}.js`)).default

    let baseConfig: Partial<ProfileConfig>, configsToMerge: FetchedConfig[]
    if (Array.isArray(fetchedConfig)) {
        baseConfig = fetchedConfig[0]
        configsToMerge = fetchedConfig
    } else {
        baseConfig = fetchedConfig
        configsToMerge = [fetchedConfig]
    }
    if (!baseConfig.extends) return [baseConfig]
    const length = baseConfig.extends.length
    let extended: string | Linter.FlatConfig
    for (let i = 0; i < length; i++) {
        extended = baseConfig.extends[i]
        if (typeof extended === 'string') mergeArr(configsToMerge, await fetchConfig(extended as Profile))
        else configsToMerge.push(extended)
    }
    return configsToMerge
}

export default async function getConfigs(options: ShinyConfig): Promise<FetchedConfig[]> {
    const configs = options.configs
    const len = configs.length
    const fetchedConfigs: FetchedConfig[] = []

    for (let i = 0; i < len; i++) {
        mergeArr(fetchedConfigs, await fetchConfig(configs[i]))
    }
    return fetchedConfigs
}
