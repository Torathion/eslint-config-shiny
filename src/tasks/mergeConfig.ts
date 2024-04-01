import { EmptyProfileConfig } from 'src/constants'
import type { ProfileConfig } from 'src/types/interfaces'

export default function mergeConfig(...configs: Partial<ProfileConfig>[]): ProfileConfig {
    const emptyConfig = Object.assign({}, EmptyProfileConfig)
    console.log(emptyConfig)
    if (!configs.length) return emptyConfig
}
