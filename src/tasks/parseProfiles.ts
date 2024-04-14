import type { Linter } from 'eslint'

import type { PartialProfileConfig } from 'src/types/interfaces'
import { DeprecatedStyleList, EsStyleReplaceList, EsTsReplaceList, GeneralBanList, TsStyleReplaceList } from 'src/lists'
import merge from 'src/utils/merge'
import ensureArray from 'src/utils/ensureArray'

import apply from './apply'
import mergeRules from './mergeRules'
import ban from './ban'
import replace from './replace'
import mergeProcessors from './mergeProcessors'
import { SrcGlob } from 'src/globs'
import isEmptyObject from 'src/utils/isEmptyObject'

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

export default function parseProfiles(profiles: PartialProfileConfig[], hasBaseConfig: boolean): Linter.FlatConfig[] {
    const length = profiles.length
    const configs: Linter.FlatConfig[] = new Array(length)
    let profile: PartialProfileConfig, config: Linter.FlatConfig
    for (let i = 0; i < length; i++) {
        profile = profiles[i]
        config = profile.apply ? apply(profile.apply) : {}
        // Every Linter.FlatConfig needs a files array
        if (profile.files?.length) config.files = profile.files
        else if (hasBaseConfig) config.files = profiles[0].files!
        else config.files = [SrcGlob]
        config.ignores = profile.ignores
        if (profile.languageOptions) {
            config.languageOptions = profile.languageOptions as any
            config.languageOptions!.globals = merge(...new Set(ensureArray(profile.languageOptions.globals)))
            // Idk where this comes from
            delete config.languageOptions?.parserOptions.globals
        }
        if (isEmptyLanguageOptions(config)) delete config.languageOptions
        config.linterOptions = profile.linterOptions
        config.settings = profile.settings
        if (profile.processor) {
            config.processor = mergeProcessors(profile.processor)
        }
        config.plugins = merge(config.plugins ?? {}, profile.plugins ?? {})
        config.rules = mergeRules(config.rules ?? {}, ...(profile.rules ?? []))
        if (hasBaseConfig && i === 0) config.rules = mergeRules(config.rules, ...baseRules())
        configs[i] = config
    }
    return configs
}
