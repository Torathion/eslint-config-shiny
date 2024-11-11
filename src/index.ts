import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import type { DisplayConfig, ShinyConfig } from './types'
import { join } from 'node:path'
import { handleCachedConfig, parseNewConfig } from './branch'
import { cwd } from './constants'
import { hasCache } from './guards'
import { DisplayTaskHandler } from './handler'
import { optimizeConfig } from './tasks'
import { mergeArr, writeError } from './utils'

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
            { color: 'yellow', text: 'Validating cache file' },
            { color: 'cyan', text: 'Applying cache' }
        ],
        generic: { color: 'magenta', text: 'Optimizing configs' },
        uncached: [
            { color: 'yellow', text: 'Fetching configs' },
            { color: 'cyan', text: 'Applying plugins' },
            { color: 'blue', text: 'Parsing profiles' }
        ]
    },
    completeMessage: 'Ready to lint after %time%!',
    optional: {
        caching: {
            color: 'magenta',
            text: `Caching final config under "${join('%root%', '.temp', 'shiny-config.json')}"`
        },
        patchVSCode: {
            color: 'cyan',
            text: 'Patching VSCode'
        },
        updateBrowserList: {
            color: 'cyan',
            text: 'Updating browser list'
        }
    },
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
