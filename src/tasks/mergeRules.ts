import type { Linter } from 'eslint'
import isConfig from '../utils/isConfig'
import merge from '../utils/merge'
import type { ProfileConfig } from '../types/interfaces'

export default function mergeRules(...rules: (ProfileConfig | Linter.RulesRecord)[]): Linter.RulesRecord {
    const len = rules.length
    const arr: Linter.RulesRecord[] = new Array(len)
    let config: ProfileConfig | Linter.RulesRecord
    for (let i = len - 1; i >= 0; i--) {
        config = rules[i]
        arr[i] = isConfig(config) ? config.rules : config
    }
    return merge(...arr) as Linter.RulesRecord
}
