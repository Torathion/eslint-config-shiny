import except from './utils/except'

export const VueBanList = ['brace-style', 'no-extra-parens', 'object-curly-spacing', 'quote-props']

export const VueStyleBanList = [
    'array-bracket-newline',
    'array-bracket-spacing',
    'array-element-newline',
    'max-attributes-per-line',
    'singleline-html-element-content-newline'
]
/**
 *  Ban list to ban rules from:
 *  - eslint
 *  - typescript-eslint
 *  - eslint-stylistic
 *  - vue
 */
export const GeneralBanList = [
    ...VueBanList,
    'arrow-parens',
    'indent',
    'semi',
    'quotes',
    'lines-around-comment',
    'padding-line-between-statements',
    'space-before-function-paren'
]

/*
 *  Rules from Eslint to Replace with TypeScriptEslint equivalents
 */
export const EsTsReplaceList = [
    'class-methods-use-this',
    'consistent-return',
    'dot-notation',
    'default-param-last',
    'no-array-constructor',
    'no-loop-func',
    'no-loss-of-precision',
    'no-redeclare',
    'no-throw-literal',
    'no-unused-vars', // doesn't understand enums
    'no-unused-expressions',
    'no-use-before-define', // confuses type declarations with definitions
    'no-useless-constructor',
    'require-await'
]

/*
 *  Rules to replace rules from Babel, Eslint, TypeScriptEslint for Eslint Stylistic equivalents
 */
export const EsStyleReplaceList = [
    'comma-spacing',
    'func-call-spacing',
    'key-spacing',
    'keyword-spacing',
    'lines-between-class-members',
    'no-extra-semi',
    'space-before-blocks',
    'space-infix-ops'
]

export const TsStyleReplaceList = ['type-annotation-spacing']

/*
 *  Replaces the rules from @stylistic/ts for the eslint-plugin-vue equivalents in the vue profile.
 */
export const StyleVueReplaceList = [
    ...except(EsStyleReplaceList, ['lines-between-class-members', 'no-extra-semi', 'space-before-blocks']),
    'block-spacing',
    'func-call-spacing'
]

/**
 *  Eslint rules that are now deprecated in favor of @stylistic/js
 */
export const DeprecatedStyleList = ['arrow-spacing', 'eol-last', 'no-trailing-spaces', 'space-in-parens']

export const JsxStyleReplaceList = [
    'jsx-closing-bracket-location',
    'jsx-closing-tag-location',
    'jsx-equals-spacing',
    'jsx-indent',
    'jsx-indent-props',
    'jsx-props-no-multi-spaces',
    'jsx-self-closing-comp',
    'jsx-tag-spacing',
    'jsx-wrap-multilines'
]
