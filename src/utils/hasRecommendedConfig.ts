import { Plugin } from '../types'

export default function hasRecommendedConfig(plugin: Plugin): boolean {
    return !!plugin.configs.recommended
}
