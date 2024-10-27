import * as eslintrc from '@eslint/eslintrc'
import js from '@eslint/js'
import globals from 'globals'
import styleJs from '@stylistic/eslint-plugin-js'
import styleTs from '@stylistic/eslint-plugin-ts'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import arrayFunc from 'eslint-plugin-array-func'
import es from 'eslint-plugin-es-x'
import eslintComments from 'eslint-plugin-eslint-comments'
import importPlugin from 'eslint-plugin-import-x'
import promise from 'eslint-plugin-promise'
import regexp from 'eslint-plugin-regexp'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import noSecrets from 'eslint-plugin-no-secrets'
import autofix from 'eslint-plugin-autofix'

import { ExcludeGlobs, SrcGlob } from '../globs'
import type { PartialProfileConfig, ProfileConfig } from '../types/interfaces'
import { ALWAYS, FIELD, METHOD, NEVER } from 'src/constants'

const JSExtensions = ['.js', '.cjs', '.mjs', '.jsx', '.mjsx']
const TSExtensions = ['.ts', '.mts', '.tsx', '.mtsx']
const AllExtensions = [...JSExtensions, ...TSExtensions]

export const config: ProfileConfig = {
    apply: {
        'array-func': arrayFunc,
        'eslint-comments': eslintComments,
        'import-x': importPlugin,
        promise,
        regexp,
        sonarjs,
        unicorn
    },
    files: [SrcGlob],
    ignores: ExcludeGlobs,
    languageOptions: {
        ecmaVersion: 'latest',
        globals: [globals.es2021, globals.commonjs, eslintrc.Legacy.environments.get('es2024').globals],
        parser: tsParser,
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        sourceType: 'module'
    },
    linterOptions: {
        reportUnusedDisableDirectives: true
    },
    name: 'base',
    plugins: {
        autofix,
        'es-x': es,
        'no-secrets': noSecrets,
        styleJs,
        styleTs,
        ts
    },
    rules: [
        es.configs['no-new-in-esnext'],
        js.configs.recommended,
        ts.configs['strict-type-checked'],
        ts.configs['stylistic-type-checked'],
        {
            'accessor-pairs': 0, // nonsensical rule for readonly or writeonly properties
            'array-func/prefer-array-from': 0, // incredibly slow
            'arrow-body-style': 2,
            'autofix/eqeqeq': 1,
            'autofix/no-proto': 1,
            eqeqeq: 2,
            'autofix/no-useless-concat': 1,
            'guard-for-in': 2,
            'import-x/export': 0, // broken and forgotten
            'import-x/no-cycle': 0,
            'import-x/no-named-as-default': 0,
            'logical-assignment-operators': 1,
            'no-alert': 1,
            'no-case-declarations': 0,
            'no-console': 1,
            'no-constructor-return': 2,
            'no-control-regex': 0,
            'no-div-regex': 1,
            'no-dupe-class-members': 0,
            'no-duplicate-imports': [1, { includeExports: true }],
            'no-else-return': 1,
            'no-eq-null': 2,
            'no-eval': 2,
            'no-extend-native': 2,
            'no-extra-bind': 1,
            'no-extra-label': 1,
            'no-fallthrough': 0,
            'no-floating-decimal': 1,
            'no-implicit-globals': 1,
            'no-implied-eval': 2,
            'no-iterator': 2,
            'no-label-var': 2,
            'no-lone-blocks': 1,
            'no-lonely-if': 1,
            'no-loss-of-precision': 1,
            'no-new-wrappers': 2,
            'no-object-constructor': 2,
            'no-param-reassign': 0,
            'no-proto': 2,
            'no-promise-executor-return': 2,
            'no-redeclare': 2,
            'no-return-assign': 2,
            'no-script-url': 2,
            'no-secrets/no-secrets': [2, { tolerance: 4.2 }],
            'no-sequences': 2,
            'no-template-curly-in-string': 1,
            'no-unmodified-loop-condition': 2,
            'no-undef': 0, // NodeJS namespace is undefined
            'no-undef-init': 1,
            'no-underscore-dangle': 1,
            'no-unneeded-ternary': 1,
            'no-useless-call': 1,
            'no-useless-computed-key': 1,
            'no-useless-concat': 1,
            'no-useless-rename': 1,
            'no-useless-return': 1,
            'no-var': 1,
            'no-void': 2,
            'no-warning-comments': 1,
            'object-shorthand': 2,
            'operator-assignment': 2,
            'prefer-arrow-callback': 2,
            'prefer-const': 2,
            'prefer-exponentiation-operator': 1,
            'prefer-numeric-literals': 1,
            'prefer-object-has-own': 2,
            'prefer-promise-reject-errors': 1,
            'prefer-regex-literals': 1,
            'prefer-spread': 1,
            'prefer-template': 1,
            'promise/always-return': 0,
            'promise/param-names': 0,
            'regexp/strict': 0, // interferes with unicorn/better-regex
            'styleJs/array-bracket-spacing': 1,
            'styleJs/computed-property-spacing': 1,
            'styleJs/dot-location': [1, 'property'],
            'styleJs/eol-last': 1,
            'styleJs/generator-star-spacing': [1, 'after'],
            'styleJs/implicit-arrow-linebreak': 1,
            'styleJs/multiline-comment-style': 1,
            'styleJs/new-parens': 1,
            'styleJs/no-confusing-arrow': 1,
            'styleJs/no-floating-decimal': 1,
            'styleJs/no-mixed-spaces-and-tabs': [1, 'smart-tabs'],
            'styleJs/no-multi-spaces': 1,
            'styleJs/no-multiple-empty-lines': 1,
            'styleJs/no-trailing-spaces': 1,
            'styleJs/no-whitespace-before-property': 1,
            'styleJs/nonblock-statement-body-position': 1,
            'styleJs/rest-spread-spacing': [1, NEVER],
            'styleJs/space-in-parens': 1,
            'styleJs/space-unary-ops': [1, { words: true, nonwords: false }],
            'styleJs/spaced-comment': [1, ALWAYS],
            'styleJs/switch-colon-spacing': 1,
            'styleJs/template-curly-spacing': 1,
            'styleJs/template-tag-spacing': 1,
            'styleJs/wrap-iife': [1, 'inside'],
            'styleJs/yield-star-spacing': [1, 'after'],
            'styleTs/brace-style': 1,
            'styleTs/function-call-spacing': 1,
            'styleTs/key-spacing': 1,
            'styleTs/keyword-spacing': 1,
            'styleTs/lines-between-class-members': [
                1,
                {
                    enforce: [
                        { blankLine: NEVER, prev: FIELD, next: FIELD },
                        { blankLine: ALWAYS, prev: FIELD, next: METHOD },
                        { blankLine: ALWAYS, prev: METHOD, next: METHOD }
                    ]
                }
            ],
            'styleTs/no-extra-parens': [1, 'all', { ignoreJSX: 'all' }],
            'styleTs/space-before-blocks': 1,
            'styleTs/space-before-function-paren': [
                1,
                {
                    anonymous: ALWAYS,
                    named: NEVER,
                    asyncArrow: ALWAYS
                }
            ],
            'styleTs/space-infix-ops': 1,
            'styleTs/type-annotation-spacing': 1,
            'ts/class-methods-use-this': 2,
            'ts/consistent-type-exports': 2,
            'ts/default-param-last': 2,
            'ts/dot-notation': 2,
            'ts/explicit-function-return-type': 2,
            'ts/method-signature-style': 2,
            'ts/naming-convention': [
                2,
                {
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                    selector: 'variableLike',
                    trailingUnderscore: 'allow'
                }
            ],
            'ts/no-array-constructor': 2,
            'ts/no-import-type-side-effects': 2,
            'ts/no-loop-func': 2,
            'ts/no-misused-promises': [2, { checksVoidReturn: false }], // Fixes eslint errors for async html event handlers
            'ts/no-non-null-assertion': 0,
            'ts/no-shadow': 2,
            'ts/no-this-alias': 0,
            'ts/no-unnecessary-condition': [2, { allowConstantLoopConditions: true }],
            'ts/no-unnecessary-parameter-property-assignment': 1,
            'ts/no-unnecessary-qualifier': 1,
            'ts/no-unsafe-argument': 0,
            'ts/no-unsafe-assignment': 0,
            'ts/no-unsafe-call': 0,
            'ts/no-unsafe-member-access': 0,
            'ts/no-unsafe-return': 0,
            'ts/no-unsafe-unary-minus': 2,
            'ts/no-unused-expressions': 2,
            'ts/no-unused-vars': [
                2,
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    varsIgnorePattern: '^_'
                }
            ],
            'ts/no-useless-constructor': 2,
            'ts/no-useless-empty-export': 2,
            'ts/prefer-readonly': 1,
            'ts/prefer-string-starts-ends-with': 0,
            'ts/promise-function-async': 2,
            'ts/require-array-sort-compare': 1,
            'ts/require-await': 2,
            'ts/restrict-template-expressions': 0,
            'ts/switch-exhaustiveness-check': 2,
            'ts/unbound-method': 0, // is against fp
            'unicorn/no-array-callback-reference': 0, // Makes reusing mappers impossible.
            'unicorn/catch-error-name': 0, // unnecessary
            'unicorn/custom-error-definition': 2,
            'unicorn/expiring-todo-comments': 0,
            'unicorn/explicit-length-check': 0, // makes the code longer
            'unicorn/filename-case': 0,
            'unicorn/import-style': 0, // wants default imports of node modules
            'unicorn/no-await-expression-member': 0,
            'unicorn/no-for-loop': 0, // for of loop is slower
            'unicorn/no-new-array': 0, // idk why this exists. Array.from({length}) is embarrassingly slow
            'unicorn/no-object-as-default-parameter': 0, // interferes with default options
            'unicorn/no-static-only-class': 0,
            'unicorn/no-this-assignment': 0,
            'unicorn/no-useless-undefined': 0,
            'unicorn/number-literal-case': 0,
            'unicorn/numeric-separators-style': 0,
            'unicorn/prefer-event-target': 0,
            'unicorn/prefer-modern-math-apis': 0, // Rewrites micro-optimized mathematical code with much slower code (e.g. Math.hypot).
            'unicorn/prefer-math-trunc': 0, // bitwise is faster at smaller numbers
            'unicorn/prefer-modern-maths-apis': 0, // Some comfort functions kill the performance, like Math.hypot for distance calculations
            'unicorn/prefer-number-properties': 0, // enforces bigger syntax, which is bad
            'unicorn/prefer-query-selector': 0, // slower
            'unicorn/prefer-spread': 0, // WAY SLOWER
            'unicorn/prefer-string-raw': 0, // Around 900x slower
            'unicorn/prefer-string-slice': 0, // slower
            'unicorn/prevent-abbreviations': 0, // changes way to many abbreviations to configure individually
            'unicorn/switch-case-braces': 0, // makes the code unnecessary larger
            'unicorn/text-encoding-identifier-case': 0, // some libraries define it differently
            yoda: 2
        }
    ],
    settings: {
        'import-x/extensions': AllExtensions,
        'import-x/external-module-folders': ['node_modules', 'node_modules/@types'],
        'import-x/ignore': ['node_modules'],
        'import-x/parsers': {
            '@typescript-eslint/parser': TSExtensions,
            espree: JSExtensions
        },
        'import-x/resolver': {
            'eslint-import-resolver-custom-alias': {
                alias: {
                    '@': './src'
                },
                extensions: ['.vue', '.json', '.ts', '.js']
            },
            node: {
                extensions: AllExtensions,
                resolvePaths: ['node_modules/@types']
            },
            typescript: true
        }
    }
}

const disableTypeChecked = ts.configs['disable-type-checked']

/**
 *   Array of basic eslint configs
 */
const base: PartialProfileConfig[] = [
    config,
    {
        extends: [disableTypeChecked],
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'script'
        },
        name: 'base-script'
    },
    {
        extends: [disableTypeChecked],
        files: ['**/*.cjs'],
        languageOptions: {
            sourceType: 'commonjs'
        },
        name: 'base-cjs'
    }
]
export default base
