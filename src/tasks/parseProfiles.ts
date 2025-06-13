import type { FlatConfig, SharedConfig } from '@typescript-eslint/utils/ts-eslint'

import type { ProfileRules } from 'src/types'
import type { CacheOptions, LanguageOptions, ParseProfilesResult, ProfileConfig, ShinyConfig } from 'src/types/interfaces'

import type { DeepPartial, Table } from 'typestar'
import { ensureArr, isArray, isEmptyObj, mergeArr, mergeObj, refMergeObj } from 'compresso'
import { SrcGlob } from 'src/globs'
import { hasRuleRecord } from 'src/guards'
import apply from './apply'
import mergeProcessors from './mergeProcessors'
import type { ESLint } from 'eslint'

function isEmptyLanguageOptions(config: FlatConfig.Config): boolean {
    const langOpts = config.languageOptions
    if (!langOpts || isEmptyObj(langOpts as Table<unknown>)) return true
    if (langOpts.parserOptions) {
        const parserOpts = langOpts.parserOptions
        if (isEmptyObj(parserOpts)) return true
        return !!parserOpts.project && !(parserOpts.project as string).length
    }
    return !!langOpts.globals && isEmptyObj(langOpts.globals)
}

function mergeRules(rules: SharedConfig.RulesRecord[]): SharedConfig.RulesRecord {
    let newRules: SharedConfig.RulesRecord = {}
    const len = rules.length
    for (let i = 0; i < len; i++) {
        newRules = refMergeObj(newRules, rules[i])
    }
    return newRules
}

function parseArrayConfigRules(configs: FlatConfig.Config[]): Partial<Table<SharedConfig.RuleEntry>> {
    const rules: SharedConfig.RulesRecord = {}
    const length = configs.length
    let config: FlatConfig.Config
    for (let i = 0; i < length; i++) {
        config = configs[i]
        if (!config.rules || isEmptyObj(config.rules)) continue
        refMergeObj(rules, config.rules)
    }
    return rules
}

function parseRules(rules?: ProfileRules[]): SharedConfig.RulesRecord[] {
    if (!rules) return []
    const length = rules.length
    if (!length) return []
    const newArr: SharedConfig.RulesRecord[] = new Array(length)
    let record: ProfileRules
    for (let i = 0; i < length; i++) {
        record = rules[i]
        if (isArray(record)) newArr[i] = parseArrayConfigRules(record)
        else newArr[i] = hasRuleRecord(record) ? record.rules! : record
    }
    return newArr
}

function requireArrayProp(
    config: FlatConfig.Config,
    profile: DeepPartial<ProfileConfig>,
    profiles: DeepPartial<ProfileConfig>[],
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

export default function parseProfiles(opts: ShinyConfig, profiles: DeepPartial<ProfileConfig>[], hasBaseConfig: boolean): ParseProfilesResult {
    const length = profiles.length
    const configs: FlatConfig.Config[] = new Array(length)
    const cacheOpts: (CacheOptions | undefined)[] = new Array(length)
    let config: FlatConfig.Config,
        isMain: boolean,
        langOpts: LanguageOptions,
        profile: DeepPartial<ProfileConfig>,
        tempRules: SharedConfig.RulesRecord[]
    for (let i = 0; i < length; i++) {
        profile = profiles[i]
        isMain = hasBaseConfig && i === 0
        if (isMain) config = apply(opts.apply ? mergeObj(profile.apply!, opts.apply) : (profile.apply as Table<ESLint.Plugin>))
        else config = profile.apply ? apply(profile.apply as Table<ESLint.Plugin>) : {}
        // Every FlatConfig.Config needs a files array
        requireArrayProp(config, profile, profiles, 'files', isMain, defaultFiles)
        requireArrayProp(config, profile, profiles, 'ignores', isMain, defaultIgnores)
        if (profile.languageOptions) {
            langOpts = config.languageOptions = profile.languageOptions as any
            langOpts!.globals = mergeObj(...ensureArr(profile.languageOptions.globals))
        }
        // Eslint fails if you have an empty languageOptions prop
        if (isEmptyLanguageOptions(config)) delete config.languageOptions
        if (profile.linterOptions) config.linterOptions = profile.linterOptions
        if (profile.settings) config.settings = profile.settings
        if (profile.processor) config.processor = mergeProcessors(profile.processor)
        config.plugins = mergeObj(config.plugins ?? {}, profile.plugins ?? {})
        tempRules = []
        if (config.rules) mergeArr(tempRules, ensureArr(config.rules as any))
        if (profile.rules) mergeArr(tempRules, parseRules(profile.rules))
        if (isMain) config.languageOptions!.parserOptions!.tsconfigRootDir = opts.root
        config.rules = mergeRules(tempRules)
        configs[i] = config
        cacheOpts[i] = profile.cache as CacheOptions
    }
    return { cacheOpts, configs }
}
