import type { ProfileConfig, ShinyConfig } from 'src/types/interfaces'
import type { Profile } from 'src/types/types'

const defaults: ShinyConfig = {
    configs: ['base'],
    prettier: true,
    gitignore: true,
    eslintignore: false
}

export default async function getConfigs(options: ShinyConfig): Promise<ProfileConfig> {
    const opts = Object.assign({}, defaults, options)
    const configs = opts.configs
    const len = configs.length

    let config: Partial<ProfileConfig>
    for (let i = 0; i < len; i++) {
        config =
    }
}
