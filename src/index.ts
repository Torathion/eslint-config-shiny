import { join } from 'node:path'
import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import { handleCachedConfig, parseNewConfig } from './branch'
import { hasCache } from './guards'
import { DisplayTaskHandler } from './handler'
import { optimizeConfig } from './tasks'
import type { DisplayConfig, ShinyConfig } from './types'
import { mergeArr, writeError } from './utils'
import { cwd } from './constants'

const defaults: ShinyConfig = {
    cache: true,
    configs: ['base'],
    ignoreFiles: ['.gitignore'],
    indent: false,
    patchVSCode: true,
    prettier: true,
    rename: {
        '@eslint-react': 'react',
        '@microsoft/sdl': 'sdl',
        '@stylistic/js': 'styleJs',
        '@stylistic/jsx': 'styleJsx',
        '@stylistic/ts': 'styleTs',
        '@typescript-eslint': 'ts',
        '@vitest': 'vitest'
    },
    root: cwd,
    trim: ['@eslint-community/'],
    updateBrowsersList: false
}

const displayOptions: DisplayConfig = {
    branches: {
        cached: [
            { text: 'Validating cache file', color: 'yellow' },
            { text: 'Applying cache', color: 'cyan' }
        ],
        uncached: [
            { text: 'Fetching configs', color: 'yellow' },
            { text: 'Applying plugins', color: 'cyan' },
            { text: 'Parsing profiles', color: 'blue' }
        ],
        generic: { text: 'Optimizing configs', color: 'magenta' }
    },
    optional: {
        caching: {
            text: `Caching final config under "${join('%root%', '.temp', 'shiny-config.json')}"`,
            color: 'magenta'
        },
        patchVSCode: {
            text: 'Patching VSCode',
            color: 'cyan'
        }
    },
    completeMessage: 'Ready to lint after %time%!',
    options: {
        dots: true
    }
}

export default async function shiny(options?: Partial<ShinyConfig>): Promise<FlatConfig.Config[]> {
    const opts = Object.assign({}, defaults, options)
    opts.rename = Object.assign({}, defaults.rename, options?.rename ?? {})
    opts.trim = options?.trim ? mergeArr(defaults.trim, options.trim) : defaults.trim
    const isEmpty = !opts.configs.length
    if (isEmpty && !opts.cache) return []
    const display = new DisplayTaskHandler(opts, displayOptions)
    const isCached = hasCache(opts)
    display.setBranch(isCached ? 'cached' : 'uncached')
    display.start()
    try {
        const configs = await (isCached ? handleCachedConfig(opts, display) : parseNewConfig(opts, display))
        display.next()
        optimizeConfig(configs, opts, isCached)
        display.finish(opts)
        return configs
    } catch (e) {
        writeError(e as Error)
        process.exit(1)
    }
}
