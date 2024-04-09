import type { Linter } from 'eslint'
import type { PartialProfileConfig } from 'src/types/interfaces'
import apply from './apply'
import mergeRules from './mergeRules'
import ban from './ban'
import replace from './replace'
import { DeprecatedStyleList, EsStyleReplaceList, EsTsReplaceList, GeneralBanList, TsStyleReplaceList } from 'src/lists'
import merge from 'src/utils/merge'
import ensureArray from 'src/utils/ensureArray'
import mergeProcessors from './mergeProcessors'

function baseRules(): Linter.RulesRecord[] {
    return [
        ban(GeneralBanList, ['eslint', '@typescript-eslint', '@stylistic/ts']),
        replace(EsTsReplaceList, ['eslint'], ['@typescript-eslint']),
        replace(EsStyleReplaceList, ['eslint', '@typescript-eslint'], ['@stylistic/ts']),
        replace(DeprecatedStyleList, ['eslint'], ['@stylistic/js']),
        replace(TsStyleReplaceList, ['@typescript-eslint'], ['@stylistic/ts'])
    ]
}

export default function parseProfiles(profiles: PartialProfileConfig[]): Linter.FlatConfig[] {
    const length = profiles.length
    const configs: Linter.FlatConfig[] = new Array(length)
    let profile: PartialProfileConfig, config: Linter.FlatConfig
    for (let i = 0; i < length; i++) {
        profile = profiles[i]
        config = profile.apply ? apply(profile.apply) : {}
        config.files = profile.files
        config.ignores = profile.ignores
        if (profile.languageOptions) {
            config.languageOptions = profile.languageOptions as any
            config.languageOptions!.globals = merge(...[...new Set(ensureArray(profile.languageOptions.globals))])
        }
        config.linterOptions = profile.linterOptions
        config.settings = profile.settings
        if (profile.processor) {
            config.processor = mergeProcessors(profile.processor)
        }
        config.plugins = merge(config.plugins ?? {}, profile.plugins ?? {})
        config.rules = mergeRules(config.rules ?? {}, ...(profile.rules ?? []))
        if (i === 0) config.rules = mergeRules(config.rules, ...baseRules())
        configs[i] = config
    }
    return configs
}
