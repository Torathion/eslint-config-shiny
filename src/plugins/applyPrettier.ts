import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint'
import { type FileHandle, open } from 'node:fs/promises'
import { join } from 'node:path'
import type { PartialProfileConfig, ShinyConfig } from 'src/types/interfaces'
import type { ArrayOption } from '../types/types'
import fileToJson from 'src/utils/fileToJson'
import { NEVER, ALWAYS, WARN } from 'src/constants'

const prettierRuleDict: Record<string, string> = {
    arrowParens: 'arrow-parens',
    bracketSpacing: 'block-spacing',
    endOfLine: 'linebreak-style',
    quoteProps: 'quote-props',
    semi: 'semi',
    singleQuote: 'quotes',
    trailingComma: 'comma-dangle'
}

/**
 *  Rules defined in @stylistic/js, but are extended in @stylistic/ts. If there is a TSConfig found, use the typescript alternatives.
 */
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
    // The rule validator does not allow entries of type [number, number, object]
    const value = [WARN, useTabs && prettierValue ? 'tab' : prettierValue || 4]
    if (extraOptions) value.push(extraOptions)
    return value
}

function handleMeasurements(opts: ShinyConfig, rules: SharedConfig.RulesRecord, rule: string, prettierValue: boolean | number): void {
    const isTabWidth = rule === 'tabWidth'
    if (rule === 'printWidth' || isTabWidth) {
        let value: ArrayOption | undefined = rules[maxLenRule] as ArrayOption | undefined
        if (!value) value = rules[maxLenRule] = [1, {}]
        value[1][maxLenDict[rule]] = prettierValue
    }
    const usesTabs = rule === 'useTabs'
    if ((usesTabs || isTabWidth) && opts.indent) {
        let value: any = rules[indentRule]
        if (!value) value = rules[indentRule] = [WARN, {}]
        if (usesTabs && prettierValue) value[1] = 'tab'
        if (isTabWidth && typeof prettierValue === 'number') {
            value[1] = value[1] === 'tab' ? value[1] : prettierValue
            // options
            if (!value[1]) {
                const halfIndent = Math.floor(prettierValue / 1)
                value[1] = {
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
        if (opts.configs.includes('vue')) rules['vue/html-indent'] = setIndentValue(rules['vue/html-indent'], usesTabs, prettierValue)
        if (opts.configs.includes('react') && typeof prettierValue === 'number') {
            let rule = '@stylistic/jsx/jsx-indent'
            rules[rule] = setIndentValue(rules[rule], usesTabs, prettierValue, {
                checkAttributes: true,
                indentLogicalExpressions: true
            })
            rule = '@stylistic/jsx/jsx-indent-props'
            rules[rule] = setIndentValue(rules[rule], usesTabs, prettierValue)
        }
    }
}

function applyAdditionalRules(rules: SharedConfig.RulesRecord, usedPlugin: string, rule: string, isFalseValue: boolean): void {
    switch (rule) {
        case 'semi':
            rules[`${usedPlugin}/no-extra-semi`] = isFalseValue ? 0 : 1
            rules['@stylistic/js/semi-spacing'] = isFalseValue ? 0 : 1
            rules['@stylistic/js/semi-style'] = [1, isFalseValue ? 'first' : 'last']
            rules['@stylistic/ts/member-delimiter-style'] = isFalseValue
                ? 0
                : [
                      1,
                      {
                          multiline: { delimiter: 'semi' },
                          singleline: { delimiter: 'semi', requireLast: false }
                      }
                  ]
            break
        case 'useTabs':
            rules[`@stylistic/js/no-tabs`] = isFalseValue ? 1 : 0
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
            eslintValue = [1, isFalseValue ? NEVER : ALWAYS]
            rules[`${usedPlugin}/object-curly-spacing`] = eslintValue
            break
        case 'arrow-parens':
        case 'quote-props':
            /*
             * arrowParens only has the options "avoid" and "always". "consistent" is eslint-only
             * quote-props only accepts "consistent" and "as-needed" from prettier. "preserve" is to turn it off.
             */
            eslintValue = isFalseValue ? 0 : [1, value]
            break
        case 'semi':
            eslintValue = [1, isFalseValue ? NEVER : ALWAYS]
            break
        case 'quotes':
            eslintValue = [1, isFalseValue ? 'double' : 'single', { avoidEscape: true }]
            break
        case 'comma-dangle':
            eslintValue = isFalseValue ? [1, NEVER] : [1, value === 'all' ? ALWAYS : 'only-multiline']
            break
        case 'linebreak-style':
            eslintValue = [1, value === 'lf' ? 'unix' : 'windows']
            break
        default:
            throw new Error(`Unknown prettier option ${rule}.`)
    }
    rules[`${usedPlugin}/${convertedRule}`] = eslintValue
    applyAdditionalRules(rules, usedPlugin, convertedRule, isFalseValue)
}
/**
 *  Eslint-config-shiny extra task to read the projects prettier config and apply style rules according to that.
 *
 *  @param opts - config options
 *  @returns the generated style rules.
 */

const name = 'prettier-apply'

export default async function applyPrettier(opts: ShinyConfig): Promise<PartialProfileConfig> {
    let file: FileHandle
    const rules: SharedConfig.RulesRecord = {}
    try {
        file = await open(join(opts.root, '.prettierrc'), 'r')
    } catch {
        return { name, rules: [] }
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
        name,
        rules: [rules]
    }
}
