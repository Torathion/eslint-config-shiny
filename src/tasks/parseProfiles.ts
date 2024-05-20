import type { Linter } from 'eslint'

import type { LanguageOptions, PartialProfileConfig, ShinyConfig } from 'src/types/interfaces'
import {
    AutoFixList,
    DeprecatedStyleList,
    EsStyleReplaceList,
    EsTsReplaceList,
    GeneralBanList,
    StyleVueReplaceList,
    TsStyleReplaceList
} from 'src/lists'
import merge from 'src/utils/merge'
import ensureArray from 'src/utils/ensureArray'
import { SrcGlob } from 'src/globs'
import isEmptyObject from 'src/guards/isEmptyObject'

import apply from './apply'
import ban from './ban'
import replace from './replace'
import mergeProcessors from './mergeProcessors'
import renameRules from 'src/utils/renameRules'
import mergeArr from 'src/utils/mergeArr'

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

function baseRules(configName = ''): Linter.RulesRecord[] {
    const eslintArr = ['eslint']
    const styleTsArr = ['styleTs']
    const tsArr = ['ts']
    const baseRules = [
        ban(GeneralBanList, ['eslint', 'ts', 'styleTs']),
        replace(EsTsReplaceList, eslintArr, tsArr),
        replace(EsStyleReplaceList, ['eslint', 'ts'], styleTsArr),
        replace(DeprecatedStyleList, eslintArr, ['styleJs']),
        replace(TsStyleReplaceList, tsArr, styleTsArr),
        replace(AutoFixList, eslintArr, ['autofix'])
    ]
    if (configName === 'vue') {
        const vueArr = ['vue']
        ban(GeneralBanList, vueArr)
        replace(StyleVueReplaceList, styleTsArr, vueArr)
    }
    return baseRules
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

export default function parseProfiles(opts: ShinyConfig, profiles: PartialProfileConfig[], hasBaseConfig: boolean): Linter.FlatConfig[] {
    const length = profiles.length
    const configs: Linter.FlatConfig[] = new Array(length)
    let profile: PartialProfileConfig, config: Linter.FlatConfig, langOpts: LanguageOptions, tempRules: Linter.RulesRecord[]
    for (let i = 0; i < length; i++) {
        profile = profiles[i]
        config = profile.apply ? apply(profile.apply) : {}
        // Every Linter.FlatConfig needs a files array
        requireArrayProp(config, profile, profiles, 'files', hasBaseConfig, defaultFiles)
        requireArrayProp(config, profile, profiles, 'ignores', hasBaseConfig, defaultIgnores)
        if (profile.languageOptions) {
            langOpts = config.languageOptions = profile.languageOptions as any
            langOpts!.globals = merge(...ensureArray(profile.languageOptions.globals))
        }
        // Eslint fails if you have an empty languageOptions prop
        if (isEmptyLanguageOptions(config)) delete config.languageOptions
        if (profile.linterOptions) config.linterOptions = profile.linterOptions
        if (profile.settings) config.settings = profile.settings
        if (profile.processor) config.processor = mergeProcessors(profile.processor)
        config.plugins = merge(config.plugins ?? {}, profile.plugins ?? {})
        tempRules = []
        // Rename applied rules. They have to be merged first in order to overwrite preset configs.
        if (config.rules) mergeArr(tempRules, renameRules(ensureArray(config.rules), opts.rename))
        // Rename profile rules before merging to prevent duplicate rules
        mergeArr(tempRules, renameRules(profile.rules ?? [], opts.rename))
        if (hasBaseConfig && i === 0) {
            mergeArr(tempRules, renameRules(baseRules(profile.name), opts.rename))
            config.languageOptions!.parserOptions!.tsconfigRootDir = opts.root
        }
        config.rules = merge({}, ...tempRules)
        configs[i] = config
    }
    return configs
}
