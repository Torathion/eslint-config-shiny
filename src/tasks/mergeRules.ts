import type { Linter } from 'eslint'

import isConfig from '../guards/isConfig'
import merge from '../utils/merge'
import type { ProfileConfig } from '../types/interfaces'

export default function mergeRules(...rules: (Linter.RulesRecord | ProfileConfig)[]): Linter.RulesRecord {
    const len = rules.length
    const arr: Linter.RulesRecord[] = new Array(len)
    let config: Linter.RulesRecord | ProfileConfig
    for (let i = len - 1; i >= 0; i--) {
        config = rules[i]
        arr[i] = isConfig(config) ? config.rules : config
    }
    return merge(...arr) as Linter.RulesRecord
}
