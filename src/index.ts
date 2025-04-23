import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import { writeError } from 'node-comb'
import type { ShinyConfig } from './types'
import { handleCachedConfig, parseNewConfig } from './branch'
import { hasCache, hasNoRules } from './guards'
import { getProjectMetadata, handleToolOptions, optimizeConfig, setupDisplayManager } from './tasks'
import Promeister, { CanceledError } from 'promeister'

Promeister.UseGlobal = true

export default async function shiny(options?: Partial<ShinyConfig>): Promise<FlatConfig.Config[]> {
    try {
        const opts = handleToolOptions(options)
        const metadata = getProjectMetadata(opts)
        const isCached = await hasCache(opts, metadata)
        const display = setupDisplayManager(opts, isCached)

        // Setup abort functionality
        if (process.listeners('SIGINT').length < 10) {
            process.on('SIGINT', async () => {
                Promeister.GlobalController.abort()
                await display.abort()
                process.exit(0)
            })
        }

        // Finish early if there are no rules to lint with.
        if (hasNoRules(opts) && !isCached) {
            display.finish('noRules')
            return []
        }
        const configs = await (isCached ? handleCachedConfig : parseNewConfig)(opts, display, metadata)
        display.next()
        optimizeConfig(configs, opts, isCached)
        display.finish('complete')
        return configs
    } catch (e) {
        // Silence all globally cancelled errors
        if (!(e instanceof CanceledError)) writeError(e as Error)
        process.exit(1)
    }
}
