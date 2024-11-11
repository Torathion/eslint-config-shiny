import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint'

import handleRuleName from '../utils/handleRuleName'

export default function ban(rules: string[], plugins: string[]): SharedConfig.RulesRecord {
    const ruleLen = rules.length
    const pluginLen = plugins.length
    const obj: SharedConfig.RulesRecord = {}

    let j: number, pluginTag: string
    for (let i = 0; i < pluginLen; i++) {
        pluginTag = plugins[i]
        for (j = 0; j < ruleLen; j++) obj[handleRuleName(pluginTag, rules[j])] = 0
    }

    return obj
}
