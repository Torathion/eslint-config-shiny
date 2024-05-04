import * as eslintrc from '@eslint/eslintrc'
import js from '@eslint/js'
import globals from 'globals'
import stylisticJs from '@stylistic/eslint-plugin-js'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import arrayFunc from 'eslint-plugin-array-func'
import deprecation from 'eslint-plugin-deprecation'
import es from 'eslint-plugin-es-x'
import eslintComments from 'eslint-plugin-eslint-comments'
import importPlugin from 'eslint-plugin-import-x'
import promise from 'eslint-plugin-promise'
import redundantUndefined from 'eslint-plugin-redundant-undefined'
import regexp from 'eslint-plugin-regexp'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import noSecrets from 'eslint-plugin-no-secrets'

import { ExcludeGlobs, SrcGlob } from '../globs'
import type { PartialProfileConfig, ProfileConfig } from '../types/interfaces'

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
        '@stylistic/js': stylisticJs,
        '@stylistic/ts': stylisticTs,
        deprecation,
        'es-x': es,
        'no-secrets': noSecrets,
        'redundant-undefined': redundantUndefined,
        ts
    },
    rules: [
        es.configs['no-new-in-esnext'],
        js.configs.recommended,
        ts.configs['strict-type-checked'],
        ts.configs['stylistic-type-checked'],
        {
            'no-secrets/no-secrets': 2,
            'accessor-pairs': 0, // nonsensical rule for readonly or writeonly properties
            'array-func/prefer-array-from': 0, // incredibly slow
            'arrow-body-style': 2,
            'consistent-this': 0,
            curly: 0,
            'default-case': 0, // unnecessary with strictly typed strings
            'default-case-last': 1,
            'deprecation/deprecation': 1,
            eqeqeq: 2,
            'func-style': 0,
            'function-paren-newline': 0,
            'id-length': 0,
            'import-x/export': 0, // broken and forgotten
            'import-x/no-cycle': 0,
            'import-x/no-named-as-default': 0,
            'line-comment-position': 0,
            'logical-assignment-operators': 2,
            'new-cap': 0, // sees () for type assertion as uppercase character
            'no-alert': 1,
            'no-case-declarations': 0,
            'no-console': 1,
            'no-control-regex': 0,
            'no-div-regex': 2,
            'no-dupe-class-members': 0,
            'no-else-return': 2,
            'no-extra-bind': 2,
            'no-extra-label': 2,
            'no-fallthrough': 0,
            'no-implicit-coercion': 0,
            'no-implicit-globals': 1,
            'no-lonely-if': 2,
            'no-multi-assign': 0,
            'no-new': 0,
            'no-new-func': 0,
            'no-param-reassign': 0,
            'no-process-env': 0,
            'no-redeclare': 0,
            'no-tabs': 0,
            'no-undef': 0, // NodeJS namespace is undefined
            'no-undef-init': 2,
            'no-unneeded-ternary': 2,
            'no-useless-computed-key': 2,
            'no-useless-concat': 2,
            'no-useless-rename': 2,
            'no-useless-return': 2,
            'no-var': 2,
            'no-void': 2,
            'nonblock-statement-body-position': 0,
            'object-shorthand': 2,
            'operator-assignment': 2,
            'prefer-arrow-callback': 2,
            'prefer-const': 2,
            'prefer-exponentiation-operator': 2,
            'prefer-numeric-literals': 2,
            'prefer-object-has-own': 2,
            'prefer-template': 2,
            'promise/always-return': 0,
            'promise/param-names': 0,
            'redundant-undefined/redundant-undefined': 2,
            'regexp/strict': 0, // interferes with unicorn/better-regex
            'spaced-comment': 0,
            'ts/consistent-type-exports': 2,
            'ts/consistent-type-imports': 0, // doesn't like dynamic imports
            'ts/explicit-function-return-type': 2,
            'ts/explicit-module-boundary-types': 2,
            'ts/max-params': 0,
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
            'ts/no-extraneous-class': 0,
            'ts/no-import-type-side-effects': 2,
            'ts/no-non-null-assertion': 0,
            'ts/no-this-alias': 0,
            'ts/no-unnecessary-qualifier': 1,
            'ts/no-unsafe-argument': 0,
            'ts/no-unsafe-assignment': 0,
            'ts/no-unsafe-call': 0,
            'ts/no-unsafe-member-access': 0,
            'ts/no-unsafe-return': 0,
            'ts/no-unsafe-unary-minus': 2,
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
            'ts/no-use-before-define': 0,
            'ts/no-useless-empty-export': 2,
            'ts/prefer-find': 2,
            'ts/prefer-readonly': 2,
            'ts/prefer-regexp-exec': 2,
            'ts/prefer-string-starts-ends-with': 0,
            'ts/promise-function-async': 2,
            'ts/require-array-sort-compare': 2,
            'ts/restrict-template-expressions': 0,
            'ts/return-await': 2,
            'ts/sort-type-constituents': 2,
            'ts/switch-exhaustiveness-check': 2,
            'ts/unbound-method': 0, // is against fp
            'unicorn/catch-error-name': 0, // unnecessary
            'unicorn/custom-error-definition': 2,
            'unicorn/expiring-todo-comments': 0,
            'unicorn/explicit-length-check': 0, // makes the code longer
            'unicorn/filename-case': 0,
            'unicorn/import-style': 0, // wants default imports of node modules
            'unicorn/no-await-expression-member': 0,
            'unicorn/no-empty-file': 1,
            'unicorn/no-for-loop': 0, // for of loop is slower
            'unicorn/no-new-array': 0, // idk why this exists. Array.from({length}) is embarrassingly slow
            'unicorn/no-object-as-default-parameter': 0, // interferes with default options
            'unicorn/no-static-only-class': 0,
            'unicorn/no-this-assignment': 0,
            'unicorn/no-useless-undefined': 0,
            'unicorn/number-literal-case': 0,
            'unicorn/numeric-separators-style': 0,
            'unicorn/prefer-event-target': 0,
            'unicorn/prefer-math-trunc': 0, // bitwise is faster at smaller numbers
            'unicorn/prefer-number-properties': 0, // enforces bigger syntax, which is bad
            'unicorn/prefer-query-selector': 0, // slower
            'unicorn/prefer-spread': 0, // WAY SLOWER
            'unicorn/prefer-string-slice': 0, // slower
            'unicorn/prefer-ternary': 1,
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
