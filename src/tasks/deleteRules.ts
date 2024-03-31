import type { ProfileConfig } from '../types/interfaces'

export default function deleteRules(config: ProfileConfig, rules: string[]): void {
    for (let i = rules.length - 1; i >= 0; i--) delete config.rules[rules[i]]
}
