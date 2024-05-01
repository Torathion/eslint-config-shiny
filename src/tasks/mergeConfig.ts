import type { PartialProfileConfig } from 'src/types/interfaces'
import isEmptyObject from 'src/guards/isEmptyObject'

function uniqueMerge<T extends unknown[]>(arr1: T, arr2?: T): T {
    return [...new Set((arr1 ?? []).slice().concat(arr2 ?? []))] as T
}

function mergeConfigDeep<T extends Record<string, any>>(o1: T, o2: T, directWriteKeys: string[], ignoreKeys: string[] = []): void {
    const keys: string[] = [...new Set(Object.keys(o1 ?? []).concat(Object.keys(o2) ?? []))]
    let o1Prop, o2Prop, value
    for (const key of keys) {
        if (ignoreKeys.includes(key)) continue
        else if (directWriteKeys.includes(key)) {
            o1[key] = o2[key] ?? o1[key]
        } else {
            o1Prop = o1[key]
            o2Prop = o2[key]
            if (Array.isArray(o1Prop)) value = uniqueMerge(o1Prop, o2Prop)
            else if (typeof o1Prop === 'object' && o1Prop !== null) value = Object.assign({}, o1Prop, o2Prop)
            else value = o2Prop ?? o1Prop
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
    if (baseLangOpts.parserOptions) {mergeConfigDeep(baseLangOpts.parserOptions as Record<string, unknown>, overwriteParserOpts, ['parser'])}
    else {baseLangOpts.parserOptions = overwriteParserOpts}
}

function removeEmpty(config: PartialProfileConfig): void {
    const keys = Object.keys(config)
    for (const key of keys) {
        if ((Array.isArray(config[key]) && !config[key].length) || isEmptyObject(config[key] as Record<string, unknown>)) delete config[key]
    }
}

export default function mergeConfig(base: PartialProfileConfig, overwriteConfig: PartialProfileConfig): PartialProfileConfig {
    const newConfig: PartialProfileConfig = Object.assign({}, base)
    mergeLanguageOptions(newConfig, overwriteConfig)
    mergeConfigDeep(newConfig, overwriteConfig, ['name'], ['extends', 'languageOptions'])
    removeEmpty(newConfig)
    return newConfig
}
