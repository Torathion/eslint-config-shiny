import type { ShinyConfig } from 'src/types'
import { cwd } from 'src/constants'
import { mergeArr } from 'compresso'

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
    strict: false,
    silent: false,
    trim: ['@eslint-community/']
}

export default function handleToolOptions(options?: Partial<ShinyConfig>): ShinyConfig {
    const opts = Object.assign({}, defaults, options)
    opts.rename = Object.assign({}, defaults.rename, options?.rename ?? {})
    if (options?.trim) mergeArr(defaults.trim, options.trim)
    opts.trim = defaults.trim
    return opts
}
