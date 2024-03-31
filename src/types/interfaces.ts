import type { Profile, Rules } from './types'

export interface ShinyConfig {
    configs: Profile[]
    prettier: boolean
    gitignore: boolean
    eslintignore: boolean
}
