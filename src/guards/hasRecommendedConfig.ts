import type { ESLint } from 'eslint'

export default function hasRecommendedConfig(plugin: ESLint.Plugin): boolean {
  return !!plugin.configs!.recommended
}
