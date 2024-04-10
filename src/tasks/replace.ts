import type { Linter } from 'eslint'

import handleRuleName from '../utils/handleRuleName'

export default function replace(rules: string[], from: string[], to: string[]): Linter.RulesRecord {
    const rulesLen = rules.length
    const fromLen = from.length
    const toLen = to.length
    const obj: Linter.RulesRecord = {}

    let rule: string, j: number
    for (let i = 0; i < rulesLen; i++) {
        rule = rules[i]

        for (j = 0; j < fromLen; j++) obj[handleRuleName(from[j], rule)] = 0
        for (j = 0; j < toLen; j++) obj[handleRuleName(to[j], rule)] = 2
    }

    return obj
}
