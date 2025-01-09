import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { ShinyConfig } from './types'
import { handleCachedConfig, parseNewConfig } from './branch'
import { hasCache, hasNoRules } from './guards'
import { handleToolOptions, optimizeConfig, setupDisplayManager } from './tasks'
import { writeError } from './utils'

export default async function shiny(options?: Partial<ShinyConfig>): Promise<FlatConfig.Config[]> {
    try {
        const opts = handleToolOptions(options)
        const isCached = await hasCache(opts)
        const display = setupDisplayManager(opts, isCached)
        // Finish early if there are no rules to lint with.
        if (hasNoRules(opts) && !isCached) {
            display.finish('noRules')
            return []
        }
        const configs = await (isCached ? handleCachedConfig(opts, display) : parseNewConfig(opts, display))
        display.next()
        optimizeConfig(configs, opts, isCached)
        display.finish('complete')
        return configs
    } catch (e) {
        writeError(e as Error)
        process.exit(1)
    }
}
