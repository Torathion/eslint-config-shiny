import type { ESLint } from 'eslint'
import { EmptyProfileConfig } from 'src/constants'
import type { PartialProfileConfig, ProfileConfig } from 'src/types/interfaces'
import ensureArray from 'src/utils/ensureArray'
import mergeArr from 'src/utils/mergeArr'

function getProp(configs: PartialProfileConfig[], key: keyof PartialProfileConfig): any {
    const length = configs.length
    const props = new Array(length)
    for (let i = 0; i < length; i++) props[i] = configs[i][key] ?? {}
    return props
}

function mergeArrProp(targetConfig: ProfileConfig, sourceConfig: PartialProfileConfig, key: keyof ProfileConfig): void {
    if (sourceConfig[key]) {
        const merged = targetConfig[key]?.slice() ?? []
        mergeArr(merged, sourceConfig[key] as any)
        targetConfig[key] = merged
    }
}

function mergeLanguageOptions(targetConfig: ProfileConfig, configs: PartialProfileConfig[]): void {
    targetConfig.languageOptions = Object.assign({}, ...getProp(configs, 'languageOptions'))
    const length = configs.length
    const globals: ESLint.Globals[] = ensureArray(targetConfig.languageOptions.globals)
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
