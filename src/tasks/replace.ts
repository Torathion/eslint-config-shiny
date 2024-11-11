import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint'

import handleRuleName from '../utils/handleRuleName'

export default function replace(rules: string[], from: string[], to: string[]): SharedConfig.RulesRecord {
    const rulesLen = rules.length
    const fromLen = from.length
    const toLen = to.length
    const obj: SharedConfig.RulesRecord = {}

    let j: number, rule: string
    for (let i = 0; i < rulesLen; i++) {
        rule = rules[i]
        for (j = 0; j < fromLen; j++) obj[handleRuleName(from[j], rule)] = 0
        for (j = 0; j < toLen; j++) obj[handleRuleName(to[j], rule)] = 2
    }

    return obj
}
