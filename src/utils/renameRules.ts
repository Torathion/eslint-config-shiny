import type { Linter } from 'eslint'

function findRename(arr: string[], str: string): number {
    const length = arr.length
    if (!length) return -1
    let index: number
    for (let i = 0; i < length; i++) {
        index = str.indexOf('/')
        if (index >= 0 && arr[i].startsWith(str.substring(0, index))) return i
    }
    return -1
}

export default function renameRules(ruleArr: Linter.RulesRecord[], renames: Record<string, string>): Linter.RulesRecord[] {
    if (!ruleArr.length) return []
    const renameKeys = Object.keys(renames)
    const len = ruleArr.length
    const newRuleArr: Linter.RulesRecord[] = []
    let index: number
    let parsedRules: any, newRules: Linter.RulesRecord
    for (let i = 0; i < len; i++) {
        parsedRules = ruleArr[i].rules ?? ruleArr[i]
        newRules = {}
        for (const rule in parsedRules) {
            index = findRename(renameKeys, rule)
            if (index >= 0) {
                newRules[rule.replace(renameKeys[index], renames[renameKeys[index]])] = parsedRules[rule]
            } else newRules[rule] = parsedRules[rule]
        }
        newRuleArr[i] = Object.assign({}, newRules)
    }
    return newRuleArr
}
