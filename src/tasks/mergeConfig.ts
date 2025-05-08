import type { PartialProfileConfig } from 'src/types/interfaces'
import { isArray, isEmptyObj, isObj, keysOf, uniqueMerge } from 'compresso'

export default function mergeConfig(base: PartialProfileConfig, overwriteConfig: PartialProfileConfig, keepOldName = false): PartialProfileConfig {
    const newConfig: PartialProfileConfig = Object.assign({}, base)
    mergeLanguageOptions(newConfig, overwriteConfig)
    const directWrite = keepOldName ? [] : ['name']
    const ignoreKeys = ['extends', 'languageOptions']
    if (keepOldName) ignoreKeys.push('name')
    mergeConfigDeep(newConfig, overwriteConfig, directWrite, ignoreKeys)
    removeEmpty(newConfig)
    return newConfig
}

function mergeConfigDeep<T extends Record<string, any>>(o1: T, o2: T, directWriteKeys: string[], ignoreKeys: string[] = []): void {
    const keys = uniqueMerge(keysOf(o1 ?? []), keysOf(o2))
    let o1Prop, o2Prop, value
    for (const key of keys) {
        if (ignoreKeys.includes(key)) continue
        else if (directWriteKeys.includes(key)) o1[key] = o2[key] ?? o1[key]
        else {
            o1Prop = o1[key]
            o2Prop = o2[key]
            if (isArray(o1Prop)) {
                if (key.startsWith('import')) uniqueMerge(o1Prop ?? [], o2Prop)
                value = uniqueMerge(o1Prop ?? [], o2Prop)
            } else if (isObj(o1Prop)) {
                value = key === 'settings' ? mergeObjectDeep(o1Prop, o2Prop) : Object.assign({}, o1Prop, o2Prop)
            } else value = o2Prop ?? o1Prop
            o1[key] = value
        }
    }
}

function mergeLanguageOptions(base: PartialProfileConfig, overwriteConfig: PartialProfileConfig): void {
    if (!overwriteConfig.languageOptions) {
        base.languageOptions ??= {}
        return
    }
    const overwriteLangOpts: Record<string, unknown> = overwriteConfig.languageOptions
    const baseLangOpts: Record<string, unknown> = (base.languageOptions ??= {})
    mergeConfigDeep(baseLangOpts, overwriteLangOpts, ['parser'], ['parserOptions'])
    const overwriteParserOpts = overwriteLangOpts.parserOptions
    if (!overwriteParserOpts) {
        baseLangOpts.parserOptions ??= {}
        return
    }
    if (baseLangOpts.parserOptions) {
        mergeConfigDeep(baseLangOpts.parserOptions as Record<string, unknown>, overwriteParserOpts, ['parser'])
    } else {
        baseLangOpts.parserOptions = overwriteParserOpts
    }
}

function mergeObjectDeep<T extends Record<string, any>>(o1: T, o2: T): T {
    for (const key in o2) {
        if (isArray(o2[key])) o1[key] = isArray(o1[key]) ? o1[key].concat(o2[key]) : o2[key]
        else if (o2[key] && isObj(o2[key])) o1[key] = mergeObjectDeep(o1[key] || {}, o2[key])
        else o1[key] = o2[key]
    }
    return o1
}

function removeEmpty(config: PartialProfileConfig): void {
    const keys = keysOf(config)
    for (const key of keys) {
        if ((isArray(config[key]) && !config[key].length) || isEmptyObj(config[key] as Record<string, unknown>)) delete config[key]
    }
}
