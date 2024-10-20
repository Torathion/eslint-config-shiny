import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
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
import { merge, ensureArray, renamePlugins, mergeArr, renameRules } from 'src/utils'

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

const defaultFiles = [SrcGlob]
const defaultIgnores: string[] = []

export default function parseProfiles(opts: ShinyConfig, profiles: PartialProfileConfig[], hasBaseConfig: boolean): ParseProfilesResult {
    const length = profiles.length
    const configs: FlatConfig.Config[] = new Array(length)
    const cacheOpts: (CacheOptions | undefined)[] = new Array(length)
    const renames = opts.rename
    let profile: PartialProfileConfig, config: FlatConfig.Config, langOpts: LanguageOptions, tempRules: Linter.RulesRecord[]
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
        config.plugins = renamePlugins(merge(config.plugins ?? {}, profile.plugins ?? {}), renames)
        tempRules = []
        // Rename applied rules. They have to be merged first in order to overwrite preset configs.
        if (config.rules) mergeArr(tempRules, renameRules(ensureArray(config.rules), renames))
        // Rename profile rules before merging to prevent duplicate rules
        mergeArr(tempRules, renameRules(profile.rules ?? [], renames))
        if (hasBaseConfig && i === 0) {
            mergeArr(tempRules, renameRules(baseRules(profile.name), renames))
            config.languageOptions!.parserOptions!.tsconfigRootDir = opts.root
        }
        config.rules = merge({}, ...tempRules)
        configs[i] = config
        cacheOpts[i] = profile.cache
    }
    return { configs, cacheOpts }
}
