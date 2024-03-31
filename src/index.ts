import { applyPrettier, findTSConfigs, parseGitignore } from './plugins'
import type { ShinyConfig } from './types/interfaces'

export { default as merge } from './utils/merge'
export { default as mergeArr } from './utils/mergeArr'

export * from './constants'
export * from './globs'
export * from './lists'
export * from './plugins'
export * from './tasks'
export * from './types'

const defaults: ShinyConfig = {
    configs: ['shiny', 'format', 'test'],
    prettier: true,
    gitignore: true,
    eslintignore: true
}

export default async function shiny(options: Partial<ShinyConfig>): Promise<string[]> {
    const opts = Object.assign({}, defaults, options)
    // 1. Run plugins
    const [prettierRules, parsedGitIgnore, tsconfigFiles] = await Promise.all([applyPrettier(opts), parseGitignore(opts), findTSConfigs()])
    // 2. Get base configs
    const config = await getConfigs(opts)
}
