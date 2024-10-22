import type { FlatConfig, SharedConfig } from '@typescript-eslint/utils/ts-eslint'
import type { Linter } from 'eslint'

import type { CacheOptions, LanguageOptions, ParseProfilesResult, PartialProfileConfig, ShinyConfig } from 'src/types/interfaces'
import {
    AutoFixList,
    DeprecatedStyleList,
    EsStyleReplaceList,
    EsTsReplaceList,
    GeneralBanList,
    StyleVueReplaceList,
    TsStyleReplaceList
} from 'src/lists'
import { SrcGlob } from 'src/globs'
import isEmptyObject from 'src/guards/isEmptyObject'

import apply from './apply'
import ban from './ban'
import replace from './replace'
import mergeProcessors from './mergeProcessors'
import { merge, ensureArray, mergeArr } from 'src/utils'
import type { ProfileRules } from 'src/types'

function isEmptyLanguageOptions(config: FlatConfig.Config): boolean {
    const langOpts = config.languageOptions
    if (!langOpts || isEmptyObject(langOpts as Record<string, unknown>)) return true
    if (langOpts.parserOptions) {
        const parserOpts = langOpts.parserOptions
        if (isEmptyObject(parserOpts)) return true
        return !!parserOpts.project && !(parserOpts.project as string).length
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
    config: FlatConfig.Config,
    profile: PartialProfileConfig,
    profiles: PartialProfileConfig[],
    prop: keyof FlatConfig.Config,
    hasBase: boolean,
    defaultValue: any
): void {
    const profileProp: any = profile[prop]
    if (profileProp?.length) config[prop] = profileProp
    else if (hasBase) config[prop] = (profiles[0][prop] as any) ?? defaultValue
    else config[prop] = defaultValue
}

function isFlatConfig(rulesRecord: ProfileRules): rulesRecord is FlatConfig.Config {
    return !!rulesRecord.rules
}

function parseRules(rules: ProfileRules[]): SharedConfig.RulesRecord[] {
    if (!rules) return []
    const length = rules.length
    if (!length) return []
    const newArr: SharedConfig.RulesRecord[] = new Array(length)
    let record: ProfileRules
    for (let i = 0; i < length; i++) {
        record = rules[i]
        newArr[i] = isFlatConfig(record) ? record.rules! : record
    }
    return newArr
}

const defaultFiles = [SrcGlob]
const defaultIgnores: string[] = []

export default function parseProfiles(opts: ShinyConfig, profiles: PartialProfileConfig[], hasBaseConfig: boolean): ParseProfilesResult {
    const length = profiles.length
    const configs: FlatConfig.Config[] = new Array(length)
    const cacheOpts: (CacheOptions | undefined)[] = new Array(length)
    let profile: PartialProfileConfig, config: FlatConfig.Config, langOpts: LanguageOptions, tempRules: SharedConfig.RulesRecord[]
    for (let i = 0; i < length; i++) {
        profile = profiles[i]
        config = profile.apply ? apply(profile.apply) : {}
        // Every FlatConfig.Config needs a files array
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
        if (config.rules) mergeArr(tempRules, ensureArray(config.rules))
        if (profile.rules) mergeArr(tempRules, parseRules(profile.rules))
        if (hasBaseConfig && i === 0) {
            mergeArr(tempRules, baseRules(profile.name))
            config.languageOptions!.parserOptions!.tsconfigRootDir = opts.root
        }
        config.rules = merge({}, ...tempRules)
        configs[i] = config
        cacheOpts[i] = profile.cache
    }
    return { configs, cacheOpts }
}
