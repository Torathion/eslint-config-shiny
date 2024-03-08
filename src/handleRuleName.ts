export default function handleRuleName(pluginTag: string, rule: string): string {
    return pluginTag === 'eslint' ? rule : `${pluginTag}/${rule}`
}
