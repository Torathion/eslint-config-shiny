import handleRuleName from '../utils/handleRuleName'

export default function ban(rules: string[], plugins: string[]): Record<string, number> {
    const ruleLen = rules.length
    const pluginLen = plugins.length
    const obj: Record<string, number> = {}

    let pluginTag: string, j: number
    for (let i = 0; i < pluginLen; i++) {
        pluginTag = plugins[i]
        for (j = 0; j < ruleLen; j++) obj[handleRuleName(pluginTag, rules[j])] = 0
    }

    return obj
}
