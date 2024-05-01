import { type FileHandle, open } from 'node:fs/promises'
import type { Linter } from 'eslint'
import type { PartialProfileConfig, ShinyConfig } from 'src/types/interfaces'
import type { ArrayOption } from '../types'
import { join } from 'node:path'
import fileToJson from 'src/utils/fileToJson'

const prettierRuleDict: Record<string, string> = {
    arrowParens: 'arrow-parens',
    bracketSpacing: 'block-spacing',
    endOfLine: 'linebreak-style',
    quoteProps: 'quote-props',
    semi: 'semi',
    singleQuote: 'quotes',
    trailingComma: 'comma-dangle'
}

const tsOverrides = new Set(['block-spacing', 'comma-dangle', 'quotes', 'quote-props'])

const maxLenDict: Record<string, string> = {
    printWidth: 'code',
    tabWidth: 'tabWidth'
}

const numericalRules = new Set(['printWidth', 'tabWidth'])
const banWords = new Set(['avoid', 'false', 'none', 'preserve'])
const ignore = new Set([
    'plugins',
    'bracketSameLine',
    'parser',
    'editorconfig',
    'embeddedLanguageFormatting',
    'experimentalTernaries',
    'jsxBracketSameLine',
    'jsxSingleQuote',
    'singleAttributePerLine',
    'useTabs',
    'vueIndentScriptAndStyle',
    'htmlWhitespaceSensitivity',
    'proseWrap',
    'insertPragma',
    'requirePragma',
    'filepath',
    'rangeStart',
    'rangeEnd'
])

const jsPlugin = '@stylistic/js'
const tsPlugin = '@stylistic/ts'
const measureRule = `${jsPlugin}/max-len`

function handleMeasurements(rules: Linter.RulesRecord, rule: string, prettierValue: number): void {
    let value: ArrayOption | undefined = rules[measureRule] as ArrayOption | undefined
    // init the value
    if (!value) value = rules[measureRule] = [2, {}]
    // get the rule from the prettier - max-len dict
    value[1][maxLenDict[rule]] = prettierValue
}

function applyAdditionalRules(rules: Linter.RulesRecord, usedPlugin: string, rule: string, isFalseValue: boolean): void {
    switch (rule) {
        case 'semi':
            rules['@stylistic/ts/member-delimiter-style'] = [
                2,
                {
                    multiline: { delimiter: isFalseValue ? 'none' : 'semi' },
                    singleline: { delimiter: 'semi', requireLast: false }
                }
            ]
            break
    }
}

function mapToEslint(rules: Linter.RulesRecord, rule: string, value: boolean | string): void {
    if (typeof value === 'boolean') value = `${value}`
    const isFalseValue = banWords.has(value)
    const convertedRule = prettierRuleDict[rule]
    const usedPlugin = tsOverrides.has(convertedRule) ? tsPlugin : jsPlugin
    let eslintValue: Linter.RuleEntry = 0
    switch (convertedRule) {
        case 'block-spacing':
            eslintValue = [2, isFalseValue ? 'never' : 'always']
            rules[`${usedPlugin}/object-curly-spacing`] = eslintValue
            break
        case 'arrow-parens':
        case 'quote-props':
            // arrowParens only has the options "avoid" and "always". "consistent" is eslint-only
            // quote-props only accepts "consistent" and "as-needed" from prettier. "preserve" is to turn it off.
            eslintValue = isFalseValue ? 0 : [2, value]
            break
        case 'semi':
            eslintValue = [2, isFalseValue ? 'never' : 'always']
            break
        case 'quotes':
            eslintValue = [2, isFalseValue ? 'double' : 'single', { avoidEscape: true }]
            break
        case 'comma-dangle':
            eslintValue = isFalseValue ? [2, 'never'] : [2, value === 'all' ? 'always' : 'only-multiline']
            break
        case 'linebreak-style':
            eslintValue = [2, value === 'lf' ? 'unix' : 'windows']
            break
        default:
            throw new Error(`Unknown prettier option ${rule}.`)
    }
    rules[`${usedPlugin}/${convertedRule}`] = eslintValue
    applyAdditionalRules(rules, usedPlugin, convertedRule, isFalseValue)
}

export default async function applyPrettier(opts: ShinyConfig): Promise<PartialProfileConfig> {
    let file: FileHandle
    const rules: Linter.RulesRecord = {}
    try {
        file = await open(join(opts.root, '.prettierrc'), 'r')
    } catch {
        return { name: 'prettier-apply', rules: [] }
    }

    const json = await fileToJson(file)
    for (const key of Object.keys(json)) {
        if (!ignore.has(key)) {
            // Handle numerical rules. Those are measurement rules
            if (numericalRules.has(key)) handleMeasurements(rules, key, json[key])
            else mapToEslint(rules, key, json[key])
        }
    }
    await file.close()
    console.log(rules)
    return {
        name: 'prettier-apply',
        rules: [rules]
    }
}
