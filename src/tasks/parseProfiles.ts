import type { Linter } from 'eslint'

import type { LanguageOptions, PartialProfileConfig } from 'src/types/interfaces'
import { DeprecatedStyleList, EsStyleReplaceList, EsTsReplaceList, GeneralBanList, TsStyleReplaceList } from 'src/lists'
import merge from 'src/utils/merge'
import ensureArray from 'src/utils/ensureArray'
import { SrcGlob } from 'src/globs'
import isEmptyObject from 'src/utils/isEmptyObject'

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
    return isEmptyObject(langOpts.globals)
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

const defaultFiles = [SrcGlob]
const defaultIgnores: string[] = []

export default function parseProfiles(profiles: PartialProfileConfig[], hasBaseConfig: boolean): Linter.FlatConfig[] {
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
        configs[i] = config
    }
    return configs
}
