import type { Config } from './types'

export default function deleteRules(config: Config, rules: string[]): void {
    for (let i = rules.length - 1; i >= 0; i--) delete config.rules[rules[i]]
}
