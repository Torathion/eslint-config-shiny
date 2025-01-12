import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { DisplayManager } from 'src/handler'
import type { ProjectMetadata, ShinyConfig } from 'src/types'
import { useCache, validateCache } from 'src/tasks'
import parseNewConfig from './parseNewConfig'

export default async function handleCachedConfig(
    opts: ShinyConfig,
    display: DisplayManager<ShinyConfig>,
    metadata: ProjectMetadata
): Promise<FlatConfig.Config[]> {
    // 1. Check for an outdated or malformed config
    const config = await validateCache(metadata, display)
    // Parse the config again, if the config file is outdated or malformed
    if (!config) {
        display.setBranch('uncached')
        display.start()
        return await parseNewConfig(opts, display, metadata)
    }
    // 2. Apply the config
    display.next()
    return await useCache(config)
}
