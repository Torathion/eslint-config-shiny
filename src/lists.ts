/**
 *  Ban list to ban rules from:
 *  - eslint
 *  - typescript-eslint
 *  - eslint-stylistic
 *  - babel
 */
export const GeneralBanList = [
    'indent',
    'no-extra-parens',
    'semi',
    'quotes',
    'lines-around-comment',
    'object-curly-spacing',
    'padding-line-between-statements',
    'quote-props',
    'space-before-function-paren'
]

/*
 *  Rules from Eslint to Replace with TypeScriptEslint equivalents
 */
export const EsTsReplaceList = [
    'class-methods-use-this',
    'consistent-return',
    'dot-notation',
    'brace-style',
    'func-call-spacing',
    'max-params',
    'no-array-constructor',
    'no-dupe-class-members', // doesn't understand overloads
    'no-extra-parens',
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
    'comma-dangle',
    'comma-spacing',
    'key-spacing',
    'keyword-spacing',
    'lines-between-class-members',
    'no-extra-semi',
    'space-before-blocks',
    'space-infix-ops'
]
