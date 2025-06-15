import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import { deepMergeObj } from 'compresso'
import { writeError } from 'node-comb'
import Promeister, { CanceledError } from 'promeister'
import type { ShinyConfig } from './types'
import { handleCachedConfig, parseNewConfig } from './branch'
import { cwd } from './constants'
import { hasCache, hasNoRules } from './guards'
import { getProjectMetadata, optimizeConfig, setupDisplayManager } from './tasks'

Promeister.UseGlobal = true

const defaults: ShinyConfig = {
  cache: true,
  configs: ['base'],
  ignoreFiles: ['.gitignore'],
  indent: false,
  optimizations: {
    numericValues: true,
    renames: true,
    trims: true
  },
  patchVSCode: true,
  prettier: true,
  rename: {
    '@eslint-react': 'react',
    '@microsoft/sdl': 'sdl',
    '@stylistic': 'style',
    '@typescript-eslint': 'ts',
    '@vitest': 'vitest'
  },
  root: cwd,
  silent: false,
  strict: false,
  trim: ['@eslint-community/']
}

export default async function shiny(options: Partial<ShinyConfig> = {}): Promise<FlatConfig.Config[]> {
  try {
    const opts = deepMergeObj(defaults, options)
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
    /* eslint-disable unicorn-x/no-process-exit */
    process.exit(1)
    /* eslint-enable unicorn-x/no-process-exit */
  }
}
