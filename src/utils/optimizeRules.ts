import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint'
import type { ShinyConfig } from 'src/types'
import type { Dict } from 'typestar'
import { isArray, isNumber, isString, keysOf } from 'compresso'

const ESLintValueMapper: Record<string, SharedConfig.RuleLevel> = {
    error: 2,
    off: 0,
    warn: 1
}

const regex = /\//g

export default function optimizeRules(opts: ShinyConfig, rules: SharedConfig.RulesRecord, renames: Dict, trims: string[]): void {
    const len = trims.length
    const { numericValues, renames: shouldRename, trims: shouldTrim } = opts.optimizations
    let i = 0,
        trim: string

    for (const rule of keysOf(rules)) {
        if (numericValues) rules[rule] = optimizeRuleValue(rules[rule])
        if (shouldRename) {
            for (const rename of keysOf(renames)) {
                if (rule.startsWith(rename)) {
                    replaceRule(rules, rule, renameRule(rule, renames, rename))
                    break
                }
            }
        }
        if (shouldTrim) {
            for (i = len - 1; i >= 0; i--) {
                trim = trims[i]
                if (rule.startsWith(trim)) {
                    replaceRule(rules, rule, rule.replace(trim, ''))
                    break
                }
            }
        }
    }
}

function optimizeRuleValue(entry: SharedConfig.RuleEntry | undefined): SharedConfig.RuleEntry {
    // if, for some reason, the rule entry is undefined, just turn off the rule
    if (!entry) return 0
    if (isString(entry)) return ESLintValueMapper[entry] ?? 0 // if the rule has a weird string as value, just turn it off.
    if (isArray(entry)) {
        // The rule validator does not allow entries with type of [number, number, object] like @stylistic/indent
        if (isString(entry[0]) && !isNumber(entry[1])) entry[0] = ESLintValueMapper[entry[0]]
        return entry
    }
    return entry
}

function renameRule(rule: string, renames: Dict, rename: string): string {
    const newString = rule.replace(rename, renames[rename])
    return (newString.match(regex)?.length ?? 0) < 2 ? newString : newString.replace('/', '-')
}

function replaceRule(rules: SharedConfig.RulesRecord, rule: string, rename: string): void {
    // Only replace, if the renamed rule doesn't exist (manual overwrite)
    rules[rename] ??= rules[rule]
    delete rules[rule]
}
