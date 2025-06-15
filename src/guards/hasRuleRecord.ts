import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'

export default function hasRuleRecord(profile: any): profile is FlatConfig.Config {
  return !!profile.rules
}
