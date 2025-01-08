import type { ShinyConfig } from 'src/types'
import { cwd } from 'src/constants'
import { mergeArr } from 'src/utils'

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

export default function handleToolOptions(options?: Partial<ShinyConfig>): ShinyConfig {
    const opts = Object.assign({}, defaults, options)
    opts.rename = Object.assign({}, defaults.rename, options?.rename ?? {})
    opts.trim = options?.trim ? mergeArr(defaults.trim, options.trim) : defaults.trim
    return opts
}
