import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint'

function count(str: string, subStr: string, overlap = false): number {
    if (subStr.length === 0) return str.length + 1

    let n = 0
    let pos = 0
    const step = overlap ? 1 : subStr.length
    while (true) {
        pos = str.indexOf(subStr, pos)
        if (pos >= 0) {
            ++n
            pos += step
        } else break
    }
    return n
}

/**
 *  Determines the index of the rename key array corresponding to the rule name.
 *
 * @param arr - rename keys
 * @param str - rule
 * @returns the index of the plugin inside the rename array, if not found, -1
 */
function findRename(renames: string[], rule: string): number {
    const length = renames.length
    if (!length) return -1
    let index: number
    for (let i = 0; i < length; i++) {
        index = rule.indexOf('/')
        if (index < 0) continue
        // Is a sub plugin
        if (rule[0] === '@' && count(rule, '/') === 2 && renames.includes(rule.substring(0, rule.lastIndexOf('/')))) {
            return renames.indexOf(rule.substring(0, rule.lastIndexOf('/')))
        }
        // Is a main plugin
        if (renames[i].startsWith(rule.substring(0, index))) return i
    }
    return -1
}

export function replaceRuleName(rule: string, renameKeys: string[], renames: Record<string, string>, id: number): string {
    let newName = rule.replace(renameKeys[id], renames[renameKeys[id]])
    if ((newName.match(/\//g) ?? []).length === 2) newName = newName.replace('/', '-')
    return newName
}

export default function renameRules(ruleArr: SharedConfig.RulesRecord[], renames: Record<string, string>): SharedConfig.RulesRecord[] {
    if (!ruleArr.length) return []
    const renameKeys = Object.keys(renames)
    const len = ruleArr.length
    const newRuleArr: SharedConfig.RulesRecord[] = []
    let index: number
    let parsedRules: any, newRules: SharedConfig.RulesRecord
    for (let i = 0; i < len; i++) {
        parsedRules = ruleArr[i].rules ?? ruleArr[i]
        newRules = {}
        for (const rule in parsedRules) {
            index = findRename(renameKeys, rule)
            if (index >= 0) newRules[replaceRuleName(rule, renameKeys, renames, index)] = parsedRules[rule]
            else newRules[rule] = parsedRules[rule]
        }
        newRuleArr[i] = Object.assign({}, newRules)
    }
    return newRuleArr
}
