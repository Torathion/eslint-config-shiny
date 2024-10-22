import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint'

const ESLintValueMapper: Record<string, SharedConfig.RuleLevel> = {
    off: 0,
    warn: 1,
    error: 2
}

const regex = /\//

function renameSubPackageRule(rule: string, renames: Record<string, string>, rename: string): string {
    const count = regex.exec(rule)?.length ?? 0
    if (count < 2) return rule
    // Only replace the first of both / with a -
    return rule.replace(rename, renames[rename]).replace('/', '-')
}

export default function optimizeRules(rules: SharedConfig.RulesRecord, renames: Record<string, string>): void {
    for (const rule of Object.keys(rules)) {
        rules[rule] = typeof rules[rule] === 'string' ? ESLintValueMapper[rules[rule]] : rules[rule] ?? 0
        for (const rename of Object.keys(renames)) {
            if (rule.startsWith(rename)) {
                rules[renameSubPackageRule(rule, renames, rename)] = rules[rule]
                delete rules[rule]
            }
        }
    }
}
