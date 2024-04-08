import { applyPrettier, findTSConfigs, parseGitignore } from './plugins'
import getConfigs from './tasks/getConfigs'
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
    configs: ['base'],
    prettier: true,
    gitignore: true,
    eslintignore: true
}

export default async function shiny(options: Partial<ShinyConfig>): Promise<void> {
    const opts = Object.assign({}, defaults, options)
    if (!opts.configs.length) return
    // 1. Run plugins
    // const [prettierRules, parsedGitIgnore, tsconfigFiles] = await Promise.all([applyPrettier(opts), parseGitignore(opts), findTSConfigs()])
    // 2. Fetch configs
    const configs = await getConfigs(opts)
    console.log('------ FINAL --------')
    console.log(configs)
    console.log(Array.from(new Set(configs[0].languageOptions?.globals)).length)
    console.log(configs.length)
}
