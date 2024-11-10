import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { DisplayTaskHandler } from 'src/handler'
import { useCache } from 'src/tasks'
import type { ShinyConfig } from 'src/types'

export default async function handleCachedConfig(opts: ShinyConfig, display: DisplayTaskHandler): Promise<FlatConfig.Config[]> {
    return await useCache(opts)
}
