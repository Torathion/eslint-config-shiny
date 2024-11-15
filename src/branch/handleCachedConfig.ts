import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { DisplayTaskHandler } from 'src/handler'
import { useCache, validateCache } from 'src/tasks'
import type { ShinyConfig } from 'src/types'
import parseNewConfig from './parseNewConfig'

export default async function handleCachedConfig(opts: ShinyConfig, display: DisplayTaskHandler): Promise<FlatConfig.Config[]> {
    // 1. Check for an outdated or malformed config
    const config = await validateCache(opts, display)
    // Parse the config again, if the config file is outdated or malformed
    if (!config) {
        display.setBranch('uncached')
        display.start()
        return await parseNewConfig(opts, display)
    }
    // 2. Apply the config
    display.next()
    return await useCache(config, opts)
}
