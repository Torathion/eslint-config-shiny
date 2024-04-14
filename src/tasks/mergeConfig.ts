import type { ParserOptions } from '@typescript-eslint/parser'
import type { ESLint } from 'eslint'

import { EmptyProfileConfig } from 'src/constants'
import type { PartialProfileConfig, ProfileConfig } from 'src/types/interfaces'
import ensureArray from 'src/utils/ensureArray'
import mergeArr from 'src/utils/mergeArr'

function getProp(configs: PartialProfileConfig[], key: keyof PartialProfileConfig, innerKey?: string): any {
    const length = configs.length
    const props = new Array(length)
    let prop: any
    for (let i = 0; i < length; i++) {
        prop = configs[i][key]
        if (!prop) prop = {}
        if (innerKey && prop[innerKey]) prop = prop[innerKey]
        props[i] = prop
    }
    return props
}

function mergeArrProp(targetConfig: ProfileConfig, sourceConfig: PartialProfileConfig, key: keyof ProfileConfig): void {
    if (sourceConfig[key]) {
        const merged = targetConfig[key]?.slice() ?? []
        mergeArr(merged, sourceConfig[key] as any)
        targetConfig[key] = merged
    }
}
function mergeProject(target: ParserOptions, configs: PartialProfileConfig[]): void {
    const length = configs.length
    // Linter.FlatConfig for some reason allows very odd types for target.project
    const projects: string[] = Array.isArray(target.project) ? target.project : []
    let config: PartialProfileConfig
    for (let i = 0; i < length; i++) {
        config = configs[i]
        if (config.languageOptions?.parserOptions?.project) mergeArr(projects, config.languageOptions.parserOptions.project)
    }
    target.project = [...new Set(projects)]
}

function mergeLanguageOptions(targetConfig: ProfileConfig, configs: PartialProfileConfig[]): void {
    const langOpts = (targetConfig.languageOptions = Object.assign({}, ...getProp(configs, 'languageOptions')))
    if (!langOpts.parserOptions) langOpts.parserOptions = {}
    const parserOpts = langOpts.parserOptions
    mergeProject(parserOpts, configs)
    langOpts.parserOptions = Object.assign({}, parserOpts ?? {}, ...getProp(configs, 'languageOptions', 'parserOptions'))
    const length = configs.length
    const globals: ESLint.Globals[] = ensureArray(langOpts.globals)
    let config: PartialProfileConfig
    for (let i = 0; i < length; i++) {
        config = configs[i]
        if (config.languageOptions?.globals) {
            mergeArr(globals, ensureArray(config.languageOptions.globals))
        }
    }
}

const ObjectProps = ['apply', 'linterOptions', 'plugins', 'settings']
const ArrayProps = ['files', 'ignores', 'rules', 'processor']

export default function mergeConfig(...configs: PartialProfileConfig[]): ProfileConfig {
    const emptyConfig: ProfileConfig = Object.assign({}, EmptyProfileConfig)
    if (!configs.length) return emptyConfig
    // Do not merge extends, as this can lead to many problems
    // Ensure that globals are properly merged
    mergeLanguageOptions(emptyConfig, configs)
    // Merge all records
    for (const prop of ObjectProps) emptyConfig[prop] = Object.assign({}, ...getProp(configs, prop))
    // Merge all array props
    const length = configs.length
    let config: PartialProfileConfig
    for (let i = 0; i < length; i++) {
        config = configs[i]
        for (const prop of ArrayProps) mergeArrProp(emptyConfig, config, prop)
    }
    return emptyConfig
}
