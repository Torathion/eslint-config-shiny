import { open, type FileHandle } from 'node:fs/promises'
import { cwd } from '../constants'
import type { ArrayOption, RuleValue, Rules } from '../types'

const prettierRuleDict: Record<string, string> = {
    arrowParens: 'arrow-parens',
    bracketSpacing: 'block-spacing',
    endOfLine: 'linebreak-style',
    quoteProps: 'quote-props',
    semi: 'semi',
    singleQuote: 'quotes',
    trailingComma: 'comma-dangle'
}

const tsOverrides = ['block-spacing', 'comma-dangle', 'quotes', 'quote-props']

const maxLenDict: Record<string, string> = {
    printWidth: 'code',
    tabWidth: 'tabWidth'
}

const numericalRules = ['printWidth', 'tabWidth']
const banWords = ['avoid', 'false', 'none', 'preserve']
const ignore = [
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
]

const jsPlugin = '@stylistic/js'
const tsPlugin = '@stylistic/ts'
const measureRule = `${jsPlugin}/max-len`

function handleMeasurements(rules: Rules, rule: string, prettierValue: number): void {
    let value: ArrayOption | undefined = rules[measureRule] as ArrayOption | undefined
    // init the value
    if (!value) value = rules[measureRule] = [2, {}]
    // get the rule from the prettier - max-len dict
    value[1][maxLenDict[rule]] = prettierValue
}

function mapToEslint(rules: Rules, rule: string, value: string | boolean): void {
    if (typeof value === 'boolean') value = `${value}`
    const isFalseValue = banWords.includes(value)
    const convertedRule = prettierRuleDict[rule]
    const usedPlugin = tsOverrides.includes(convertedRule) ? tsPlugin : jsPlugin
    let eslintValue: RuleValue = 0
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
            if (isFalseValue) eslintValue = [2, 'never']
            else eslintValue = [2, value === 'all' ? 'always' : 'only-multiline']
            break
        case 'linebreak-style':
            eslintValue = [2, value === 'lf' ? 'unix' : 'windows']
            break
        default:
            throw new Error(`Unknown prettier option ${rule}.`)
    }
    rules[`${usedPlugin}/${convertedRule}`] = eslintValue
}

export default async function applyPrettier(): Promise<Rules> {
    let file: FileHandle
    const rules: Rules = {}
    try {
        file = await open(`${cwd}/.prettierrc`, 'r')
    } catch (err) {
        return rules
    }

    const json = JSON.parse((await file.readFile()).toString())
    for (const key of Object.keys(json)) {
        if (!ignore.includes(key)) {
            // Handle numerical rules. Those are measurement rules
            if (numericalRules.includes(key)) handleMeasurements(rules, key, json[key])
            else mapToEslint(rules, key, json[key])
        }
    }
    await file.close()
    return rules
}
