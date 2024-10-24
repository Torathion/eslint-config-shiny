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

export default function optimizeRules(rules: SharedConfig.RulesRecord, renames: Record<string, string>): void {
    for (const rule of Object.keys(rules)) {
        rules[rule] = typeof rules[rule] === 'string' ? ESLintValueMapper[rules[rule]] : rules[rule] ?? 0
        for (const rename of Object.keys(renames)) {
            if (rule.startsWith(rename)) {
                rules[renameRule(rule, renames, rename)] = rules[rule]
                delete rules[rule]
            }
        }
    }
}
