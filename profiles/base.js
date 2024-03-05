import path from 'path'

import * as eslintrc from '@eslint/eslintrc'
import js from '@eslint/js'

import globals from 'globals'

import babel from '@babel/eslint-plugin'
import sdl from '@microsoft/eslint-plugin-sdl'
import shopify from '@shopify/eslint-plugin'
import ts from '@typescript-eslint/eslint-plugin'
import typeScriptParser from '@typescript-eslint/parser'
import arrayFunc from 'eslint-plugin-array-func'
import deprecation from 'eslint-plugin-deprecation'
import es from 'eslint-plugin-es-x'
import importPlugin from 'eslint-plugin-import'
import promise from 'eslint-plugin-promise'
import redundantUndefined from 'eslint-plugin-redundant-undefined'
import regexp from 'eslint-plugin-regexp'
import security from 'eslint-plugin-security'
import sonarjs from 'eslint-plugin-sonarjs'
import tsdoc from 'eslint-plugin-tsdoc'
import unicorn from 'eslint-plugin-unicorn'

import importConfig from 'eslint-plugin-import/config/typescript.js'

const equivalents = [
    'comma-spacing',
    'dot-notation',
    'brace-style',
    'func-call-spacing',
    'indent',
    'key-spacing',
    'keyword-spacing',
    'lines-between-class-members',
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
    'object-curly-spacing',
    'space-before-blocks',
    'space-before-function-paren',
    'space-infix-ops'
]

function fromEntries(iterable) {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val
        return obj
    }, {})
}

delete shopify.configs.esnext.rules['sort-class-members/sort-class-members']

export const base = {
    files: ['**/*.mjs', '**/*.mts', '**/*.ts', '**/*.tsx'],
    ignores: ['dist/**', 'node_modules/**', 'bin/**', 'build/**', '*.d.ts'],
    linterOptions: {
        reportUnusedDisableDirectives: true,
        noInlineConfig: true
    },
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: typeScriptParser,
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: path.resolve(process.cwd(), 'tsconfig.json'),
            tsconfigRootDir: process.cwd()
        },
        globals: {
            ...globals.es2021,
            ...globals.commonjs,
            ...eslintrc.Legacy.environments.get('es2024').globals
        }
    },
    settings: {
        ...importPlugin.configs.typescript.settings,
        'import/parsers': {
            espree: ['.js', '.cjs', '.mjs', '.jsx', '.mjsx'],
            '@typescript-eslint/parser': ['.ts', '.mts', '.tsx', '.mtsx']
        },
        'import/resolver': {
            ...importPlugin.configs.typescript.settings['import/resolver'],
            node: {
                resolvePaths: ['node_modules/@types'],
                extensions: ['.js', '.json', '.node', '.ts', '.d.ts']
            },
            typescript: true
        }
    },
    plugins: {
        '@babel': babel,
        '@microsoft/sdl': sdl,
        '@shopify': shopify,
        '@typescript-eslint': ts,
        'array-func': arrayFunc,
        'es-x': es,
        deprecation,
        promise,
        import: importPlugin,
        'redundant-undefined': redundantUndefined,
        regexp,
        security,
        sonarjs,
        tsdoc,
        unicorn
    },
    rules: {
        ...sdl.configs.recommended.rules,
        ...sdl.configs.typescript.rules,
        ...sdl.configs.required.rules,
        ...es.configs['no-new-in-esnext'].rules,
        ...js.configs.recommended.rules,
        ...ts.configs['eslint-recommended'].overrides[0].rules,
        ...ts.configs['recommended-requiring-type-checking'].rules,
        ...ts.configs['stylistic-type-checked'].rules,
        ...ts.configs.recommended.rules,
        ...promise.configs.recommended.rules,
        ...regexp.configs.recommended.rules,
        ...sonarjs.configs.recommended.rules,
        ...shopify.configs.esnext.rules,
        ...shopify.configs.typescript.rules,
        ...arrayFunc.configs.recommended.rules,
        ...unicorn.configs.recommended.rules,
        ...security.configs.recommended.rules,
        'redundant-undefined/redundant-undefined': 2,
        'tsdoc/syntax': 1,
        'deprecation/deprecation': 1,
        'import/order': 0, // Import groups are mostly annoying if there are only a few imports
        '@babel/new-cap': 0,
        '@babel/no-invalid-this': 0,
        '@babel/object-curly-spacing': 0,
        '@babel/semi': 0,
        '@shopify/binary-assignment-parens': 0,
        '@shopify/class-property-semi': 0,
        'array-func/prefer-array-from': 0, // incredibly slow
        'security/detect-object-injection': 0,
        // Rules replaced by @typescript-eslint versions:
        ...fromEntries(equivalents.map(name => [name, 0])),
        // @typescript-eslint versions of Standard.js rules:
        ...fromEntries(equivalents.map(name => [`@typescript-eslint/${name}`, 2])),
        '@typescript-eslint/adjacent-overload-signatures': 1,
        '@typescript-eslint/array-type': 0,
        '@typescript-eslint/ban-types': [
            2,
            {
                extendDefaults: false,
                types: {
                    String: {
                        message: 'Use string instead',
                        fixWith: 'string'
                    },
                    Boolean: {
                        message: 'Use boolean instead',
                        fixWith: 'boolean'
                    },
                    Number: {
                        message: 'Use number instead',
                        fixWith: 'number'
                    },
                    Symbol: {
                        message: 'Use symbol instead',
                        fixWith: 'symbol'
                    },
                    BigInt: {
                        message: 'Use bigint instead',
                        fixWith: 'bigint'
                    },
                    Function: {
                        message: [
                            'The `Function` type accepts any function-like value.',
                            'It provides no type safety when calling the function, which can be a common source of bugs.',
                            'It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.',
                            'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.'
                        ].join('\n')
                    },
                    // object typing
                    Object: {
                        message: [
                            'The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`.',
                            '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
                            '- If you want a type meaning "any value", you probably want `unknown` instead.'
                        ].join('\n')
                    },
                    '{}': {
                        message: [
                            '`{}` actually means "any non-nullish value".',
                            '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
                            '- If you want a type meaning "any value", you probably want `unknown` instead.'
                        ].join('\n')
                    }
                }
            }
        ],
        '@typescript-eslint/class-literal-property-style': 2,
        '@typescript-eslint/comma-dangle': 0,
        '@typescript-eslint/consistent-indexed-object-style': 2,
        '@typescript-eslint/consistent-type-assertions': 2,
        '@typescript-eslint/consistent-type-definitions': 2,
        '@typescript-eslint/consistent-type-exports': 2,
        '@typescript-eslint/consistent-type-imports': [2, { fixStyle: 'inline-type-imports' }],
        '@typescript-eslint/explicit-function-return-type': 2,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/indent': 0,
        '@typescript-eslint/lines-between-class-members': 0,
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: { delimiter: 'none' },
                singleline: { delimiter: 'semi', requireLast: false }
            }
        ],
        '@typescript-eslint/method-signature-style': 2,
        '@typescript-eslint/naming-convention': [
            2,
            {
                selector: 'variableLike',
                leadingUnderscore: 'allow',
                trailingUnderscore: 'allow',
                format: ['camelCase', 'PascalCase', 'UPPER_CASE']
            }
        ],
        '@typescript-eslint/no-base-to-string': 2,
        '@typescript-eslint/no-confusing-void-expression': 2,
        '@typescript-eslint/no-dynamic-delete': 2,
        '@typescript-eslint/no-empty-interface': [2, { allowSingleExtends: true }],
        '@typescript-eslint/no-extra-non-null-assertion': 2,
        '@typescript-eslint/no-extra-parens': 0, // use prettier instead
        '@typescript-eslint/no-extra-semi': 0, // use prettier instead
        '@typescript-eslint/no-extraneous-class': 0,
        '@typescript-eslint/no-floating-promises': 2,
        '@typescript-eslint/no-for-in-array': 2,
        '@typescript-eslint/no-import-type-side-effects': 2,
        '@typescript-eslint/no-loss-of-precision': 0,
        '@typescript-eslint/no-misused-new': 2,
        '@typescript-eslint/no-misused-promises': 2,
        '@typescript-eslint/no-namespace': 2,
        '@typescript-eslint/no-non-null-asserted-optional-chain': 2,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-this-alias': 0,
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 2,
        '@typescript-eslint/no-unnecessary-type-assertion': 2,
        '@typescript-eslint/no-unnecessary-type-constraint': 2,
        '@typescript-eslint/no-unsafe-return': 2,
        '@typescript-eslint/no-unsafe-unary-minus': 2,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-unsafe-call': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/no-unsafe-argument': 0,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-use-before-define': [
            2,
            {
                functions: false,
                classes: false,
                enums: false,
                variables: false,
                typedefs: false // Only the TypeScript rule has this option.
            }
        ],
        '@typescript-eslint/no-var-requires': 2,
        '@typescript-eslint/object-curly-spacing': 0,
        '@typescript-eslint/padding-line-between-statements': 0,
        '@typescript-eslint/prefer-function-type': 2,
        '@typescript-eslint/prefer-includes': 2,
        '@typescript-eslint/prefer-optional-chain': 2,
        '@typescript-eslint/prefer-readonly': 2,
        '@typescript-eslint/prefer-reduce-type-parameter': 2,
        '@typescript-eslint/prefer-string-starts-ends-with': 0,
        '@typescript-eslint/prefer-ts-expect-error': 2,
        '@typescript-eslint/promise-function-async': 2,
        '@typescript-eslint/quotes': 0,
        '@typescript-eslint/require-array-sort-compare': 2,
        '@typescript-eslint/restrict-template-expressions': 1,
        '@typescript-eslint/return-await': 2,
        '@typescript-eslint/semi': 0,
        '@typescript-eslint/space-before-function-paren': [2, { named: 'never' }],
        '@typescript-eslint/strict-boolean-expressions': 0,
        '@typescript-eslint/switch-exhaustiveness-check': 2,
        '@typescript-eslint/type-annotation-spacing': 2,
        'sonarjs/cognitive-complexity': 0,
        'promise/param-names': 0,
        'promise/always-return': 0,
        'unicorn/prefer-math-trunc': 0, // bitwise is faster at smaller numbers
        'unicorn/prefer-number-properties': 0, // enforces bigger syntax, which is bad
        'unicorn/prevent-abbreviations': 0, // changes way to many abbreviations to configure individually
        'unicorn/numeric-separators-style': 0,
        'unicorn/filename-case': 0,
        'unicorn/prefer-spread': 0, // WAY SLOWER
        'unicorn/switch-case-braces': 0, // makes the code unnecessary larger
        'unicorn//no-for-loop': 0, // for of loop is slower
        'unicorn/no-object-as-default-parameter': 0, // interferes with default options
        'unicorn/catch-error-name': 0, // unnecessary
        'unicorn/no-static-only-class': 0,
        'unicorn/number-literal-case': 0,
        'unicorn/prefer-query-selector': 0, // slower
        'unicorn/prefer-string-slice': 0, // slower
        'unicorn/no-new-array': 0, // idk why this exists. The alternative is embarrassingly slow
        'unicorn/explicit-length-check': 0, // makes the code longer
        'unicorn/no-null': 0, // leads to more code in WebGL
        'unicorn/no-this-assignment': 0,
        'unicorn/prefer-ternary': 1,
        'unicorn/prefer-module': 0, // remove in favor of electron
        'unicorn/consistent-function-scoping': 0,
        'unicorn/no-empty-file': 1,
        'unicorn/no-useless-undefined': 0,
        'unicorn/text-encoding-identifier-case': 0, // some libraries define it differently
        'unicorn/no-array-method-this-argument': 0, // gets confused with methods named "filter"
        'unicorn/no-await-expression-member': 0,
        'unicorn/expiring-todo-comments': 0,
        'unicorn/prefer-event-target': 0,
        'import/export': 0, // broken and forgotten
        'accessor-pairs': 0, // nonsensical rule for readonly or writeonly properties
        'arrow-parens': 0,
        'class-methods-use-this': 1,
        'comma-dangle': 0,
        'consistent-return': 0,
        'consistent-this': 0,
        curly: 0,
        'default-case': 0, // unnecessary with strictly typed strings
        'default-case-last': 1,
        'func-style': 0,
        'function-paren-newline': 0,
        'generator-star-spacing': 0,
        'id-length': 0,
        'implicit-arrow-linebreak': 0,
        'indent-legacy': 0,
        'lines-around-comment': 0,
        'lines-between-class-members': 0, // confuses constructor overloads with class members
        'line-comment-position': 0,
        'newline-per-chained-call': 0,
        'new-cap': 0, // sees () for type assertion as uppercase character
        'no-alert': 1,
        'no-case-declarations': 0,
        'no-console': 0,
        'no-control-regex': 0,
        'no-extra-semi': 0,
        'no-fallthrough': 0,
        'no-implicit-coercion': 0,
        'no-implicit-globals': 1,
        'no-loss-of-precision': 0,
        'no-mixed-operators': 0,
        'no-multi-assign': 0,
        'no-new': 0,
        'no-new-func': 0,
        'no-param-reassign': 0,
        'no-process-env': 0,
        'no-tabs': 0,
        'no-undef': 0, // NodeJS namespace is undefined
        'no-var': 2,
        'nonblock-statement-body-position': 0,
        'one-var': 0,
        'operator-linebreak': 0,
        'prefer-const': 2,
        'prefer-object-spread': 0,
        'quote-props': 0,
        'require-await': 0,
        semi: 0,
        'space-in-parens': 0,
        'spaced-comment': 2
    }
}

/**
 *   Array of basic eslint configs
 */
export const baseArray = [
    importConfig,
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'script'
        }
    },
    {
        files: ['**/*.cjs'],
        languageOptions: {
            sourceType: 'commonjs'
        }
    }
]
export default [...baseArray, base]
