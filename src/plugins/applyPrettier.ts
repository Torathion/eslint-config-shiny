import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint'
import { type FileHandle, open } from 'node:fs/promises'
import { join } from 'node:path'
import type { PartialProfileConfig, ShinyConfig } from 'src/types/interfaces'
import type { ArrayOption } from '../types/types'
import fileToJson from 'src/utils/fileToJson'
import { NEVER, ALWAYS } from 'src/constants'

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

const numericalRules = new Set(['printWidth', 'tabWidth', 'useTabs'])
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
const maxLenRule = `${jsPlugin}/max-len`
const indentRule = `${tsPlugin}/indent`

function setIndentValue(rule: any, useTabs: boolean, prettierValue: boolean | number, extraOptions?: Record<string, unknown>): any {
    if (rule) return rule
    const value = [2, useTabs && prettierValue ? 'tab' : prettierValue || 4]
    if (extraOptions) value.push(extraOptions)
    return value
}

function handleMeasurements(opts: ShinyConfig, rules: SharedConfig.RulesRecord, rule: string, prettierValue: boolean | number): void {
    const isTabWidth = rule === 'tabWidth'
    if (rule === 'printWidth' || isTabWidth) {
        let value: ArrayOption | undefined = rules[maxLenRule] as ArrayOption | undefined
        if (!value) value = rules[maxLenRule] = [2, {}]
        value[1][maxLenDict[rule]] = prettierValue
    }
    const isUseTabs = rule === 'useTabs'
    if ((isUseTabs || isTabWidth) && opts.indent) {
        let value: any = rules[indentRule]
        if (!value) value = rules[indentRule] = [2, {}]
        if (isUseTabs && prettierValue) value[1] = 'tab'
        if (isTabWidth && typeof prettierValue === 'number') {
            value[1] = value[1] === 'tab' ? value[1] : prettierValue
            // options
            if (!value[2]) {
                const halfIndent = Math.floor(prettierValue / 2)
                value[2] = {
                    ArrayExpression: halfIndent,
                    CallExpression: halfIndent,
                    FunctionExpression: {
                        body: prettierValue,
                        parameters: halfIndent
                    },
                    ImportDeclaration: halfIndent,
                    MemberExpression: halfIndent,
                    ObjectExpression: halfIndent,
                    StaticBlock: prettierValue,
                    SwitchCase: halfIndent,
                    VariableDeclarator: 'first',
                    flatTernaryExpressions: false,
                    ignoreComments: false,
                    offsetTernaryExpressions: false
                }
            }
        }
        if (opts.configs.includes('vue')) rules['vue/html-indent'] = setIndentValue(rules['vue/html-indent'], isUseTabs, prettierValue)
        if (opts.configs.includes('react') && typeof prettierValue === 'number') {
            let rule = '@stylistic/jsx/jsx-indent'
            rules[rule] = setIndentValue(rules[rule], isUseTabs, prettierValue, {
                checkAttributes: true,
                indentLogicalExpressions: true
            })
            rule = '@stylistic/jsx/jsx-indent-props'
            rules[rule] = setIndentValue(rules[rule], isUseTabs, prettierValue)
        }
    }
}

function applyAdditionalRules(rules: SharedConfig.RulesRecord, usedPlugin: string, rule: string, isFalseValue: boolean): void {
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

function mapToEslint(rules: SharedConfig.RulesRecord, rule: string, value: boolean | string): void {
    if (typeof value === 'boolean') value = `${value}`
    const isFalseValue = banWords.has(value)
    const convertedRule = prettierRuleDict[rule]
    const usedPlugin = tsOverrides.has(convertedRule) ? tsPlugin : jsPlugin
    let eslintValue: SharedConfig.RuleEntry = 0
    switch (convertedRule) {
        case 'block-spacing':
            eslintValue = [2, isFalseValue ? NEVER : ALWAYS]
            rules[`${usedPlugin}/object-curly-spacing`] = eslintValue
            break
        case 'arrow-parens':
        case 'quote-props':
            /*
             * arrowParens only has the options "avoid" and "always". "consistent" is eslint-only
             * quote-props only accepts "consistent" and "as-needed" from prettier. "preserve" is to turn it off.
             */
            eslintValue = isFalseValue ? 0 : [2, value]
            break
        case 'semi':
            eslintValue = [2, isFalseValue ? NEVER : ALWAYS]
            break
        case 'quotes':
            eslintValue = [2, isFalseValue ? 'double' : 'single', { avoidEscape: true }]
            break
        case 'comma-dangle':
            eslintValue = isFalseValue ? [2, NEVER] : [2, value === 'all' ? ALWAYS : 'only-multiline']
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
    const rules: SharedConfig.RulesRecord = {}
    try {
        file = await open(join(opts.root, '.prettierrc'), 'r')
    } catch {
        return { name: 'prettier-apply', rules: [] }
    }

    const json = await fileToJson(file)
    for (const key of Object.keys(json)) {
        if (!ignore.has(key)) {
            // Handle numerical rules. Those are measurement rules
            if (numericalRules.has(key)) handleMeasurements(opts, rules, key, json[key])
            else mapToEslint(rules, key, json[key])
        }
    }
    await file.close()
    return {
        name: 'prettier-apply',
        rules: [rules]
    }
}
