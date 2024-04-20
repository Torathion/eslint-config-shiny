import type { Linter } from 'eslint'

import type { LanguageOptions, PartialProfileConfig, ShinyConfig } from 'src/types/interfaces'
import { DeprecatedStyleList, EsStyleReplaceList, EsTsReplaceList, GeneralBanList, TsStyleReplaceList } from 'src/lists'
import merge from 'src/utils/merge'
import ensureArray from 'src/utils/ensureArray'
import { SrcGlob } from 'src/globs'
import isEmptyObject from 'src/guards/isEmptyObject'

import apply from './apply'
import mergeRules from './mergeRules'
import ban from './ban'
import replace from './replace'
import mergeProcessors from './mergeProcessors'

function isEmptyLanguageOptions(config: Linter.FlatConfig): boolean {
    const langOpts = config.languageOptions
    if (!langOpts || isEmptyObject(langOpts)) return true
    if (langOpts.parserOptions) {
        const parserOpts = langOpts.parserOptions
        if (isEmptyObject(parserOpts)) return true
        return parserOpts.project && !parserOpts.project.length
    }
    return !!langOpts.globals && isEmptyObject(langOpts.globals)
}

function baseRules(): Linter.RulesRecord[] {
    return [
        ban(GeneralBanList, ['eslint', '@typescript-eslint', '@stylistic/ts']),
        replace(EsTsReplaceList, ['eslint'], ['@typescript-eslint']),
        replace(EsStyleReplaceList, ['eslint', '@typescript-eslint'], ['@stylistic/ts']),
        replace(DeprecatedStyleList, ['eslint'], ['@stylistic/js']),
        replace(TsStyleReplaceList, ['@typescript-eslint'], ['@stylistic/ts'])
    ]
}

function requireArrayProp(
    config: Linter.FlatConfig,
    profile: PartialProfileConfig,
    profiles: PartialProfileConfig[],
    prop: keyof Linter.FlatConfig,
    hasBase: boolean,
    defaultValue: any
): void {
    const profileProp: any = profile[prop]
    if (profileProp?.length) config[prop] = profileProp
    else if (hasBase) config[prop] = (profiles[0][prop] as any) ?? defaultValue
    else config[prop] = defaultValue
}

function findRename(arr: string[], str: string): number {
    const length = arr.length
    for (let i = 0; i < length; i++) {
        if (arr[i].startsWith(str.substring(0, str.indexOf('/')))) return i
    }
    return -1
}

function renameRules(rules: Linter.RulesRecord, renames: Record<string, string>) {
    const renameKeys = Object.keys(renames)
    let index: number
    for (const rule in rules) {
        index = findRename(renameKeys, rule)
        if (index >= 0) {
            const temp = rules[rule]
            delete rules[rule]
            rules[rule.replace(renameKeys[index], renames[renameKeys[index]])] = temp
        }
    }
}

const defaultFiles = [SrcGlob]
const defaultIgnores: string[] = []

export default function parseProfiles(opts: ShinyConfig, profiles: PartialProfileConfig[], hasBaseConfig: boolean): Linter.FlatConfig[] {
    const length = profiles.length
    const configs: Linter.FlatConfig[] = new Array(length)
    let profile: PartialProfileConfig, config: Linter.FlatConfig, langOpts: LanguageOptions
    for (let i = 0; i < length; i++) {
        profile = profiles[i]
        config = profile.apply ? apply(profile.apply) : {}
        // Every Linter.FlatConfig needs a files array
        requireArrayProp(config, profile, profiles, 'files', hasBaseConfig, defaultFiles)
        requireArrayProp(config, profile, profiles, 'ignores', hasBaseConfig, defaultIgnores)
        if (profile.languageOptions) {
            langOpts = config.languageOptions = profile.languageOptions as any
            langOpts!.globals = merge(...ensureArray(profile.languageOptions.globals))
            // Idk where this comes from
        }
        // Eslint fails if you have an empty languageOptions prop
        if (isEmptyLanguageOptions(config)) delete config.languageOptions
        if (profile.linterOptions) config.linterOptions = profile.linterOptions
        if (profile.settings) config.settings = profile.settings
        if (profile.processor) config.processor = mergeProcessors(profile.processor)
        config.plugins = merge(config.plugins ?? {}, profile.plugins ?? {})
        config.rules = mergeRules(config.rules ?? {}, ...(profile.rules ?? []))
        if (hasBaseConfig && i === 0) config.rules = mergeRules(config.rules, ...baseRules())
        if (opts.rename) renameRules(config.rules, opts.rename)
        configs[i] = config
    }
    return configs
}
