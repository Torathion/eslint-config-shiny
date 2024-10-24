import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint'

const ESLintValueMapper: Record<string, SharedConfig.RuleLevel> = {
    off: 0,
    warn: 1,
    error: 2
}

const regex = /\//g

function renameRule(rule: string, renames: Record<string, string>, rename: string): string {
    const newString = rule.replace(rename, renames[rename])
    return (newString.match(regex)?.length ?? 0) < 2 ? newString : newString.replace('/', '-')
}

function optimizeRuleValue(entry: SharedConfig.RuleEntry | undefined): SharedConfig.RuleEntry {
    // if, for some reason, the rule entry is undefined, just turn off the rule
    if (!entry) return 0
    if (typeof entry === 'string') return ESLintValueMapper[entry] ?? 0 // if the rule has a weird string as value, just turn it off.
    if (Array.isArray(entry) && typeof entry[0] === 'string') {
        entry[0] = ESLintValueMapper[entry[0]]
        return entry
    }
    return entry
}

export default function optimizeRules(rules: SharedConfig.RulesRecord, renames: Record<string, string>): void {
    for (const rule of Object.keys(rules)) {
        rules[rule] = optimizeRuleValue(rules[rule])
        for (const rename of Object.keys(renames)) {
            if (rule.startsWith(rename)) {
                rules[renameRule(rule, renames, rename)] = rules[rule]
                delete rules[rule]
            }
        }
    }
}
