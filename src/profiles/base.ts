import * as eslintrc from '@eslint/eslintrc'
import js from '@eslint/js'

import globals from 'globals'

import sdl from '@microsoft/eslint-plugin-sdl'
import stylisticJs from '@stylistic/eslint-plugin-js'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import ts from '@typescript-eslint/eslint-plugin'
import typeScriptParser from '@typescript-eslint/parser'
import arrayFunc from 'eslint-plugin-array-func'
import deprecation from 'eslint-plugin-deprecation'
import es from 'eslint-plugin-es-x'
import eslintComments from 'eslint-plugin-eslint-comments'
import importPlugin from 'eslint-plugin-i'
import promise from 'eslint-plugin-promise'
import redundantUndefined from 'eslint-plugin-redundant-undefined'
import regexp from 'eslint-plugin-regexp'
import security from 'eslint-plugin-security'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'

import { ban, replace } from '../tasks'
import { ExcludeGlobs, SrcGlob } from '../globs'
import { DeprecatedStyleList, EsStyleReplaceList, EsTsReplaceList, GeneralBanList } from '../lists'
import type { PartialProfileConfig, ProfileConfig } from '../types/interfaces'
import { cwd } from '../constants'

const baseConfig: ProfileConfig = {
    extends: [importPlugin.configs.typescript],
    apply: {
        '@microsoft/sdl': sdl,
        'array-func': arrayFunc,
        'eslint-comments': eslintComments,
        promise,
        regexp,
        security,
        sonarjs,
        unicorn
    },
    files: [SrcGlob],
    ignores: ExcludeGlobs,
    linterOptions: {
        reportUnusedDisableDirectives: true
    },
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: typeScriptParser,
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            tsconfigRootDir: cwd
        },
        globals: [globals.es2021, globals.commonjs, eslintrc.Legacy.environments.get('es2024').globals]
    },
    settings: {
        'import/parsers': {
            espree: ['.js', '.cjs', '.mjs', '.jsx', '.mjsx'],
            '@typescript-eslint/parser': ['.ts', '.mts', '.tsx', '.mtsx']
        },
        'import/resolver': {
            node: {
                resolvePaths: ['node_modules/@types'],
                extensions: ['.js', '.json', '.node', '.ts', '.d.ts']
            },
            typescript: true
        }
    },
    plugins: {
        '@stylistic/js': stylisticJs,
        '@stylistic/ts': stylisticTs,
        '@typescript-eslint': ts,
        'es-x': es,
        deprecation,
        import: importPlugin,
        'redundant-undefined': redundantUndefined
    },
    rules: [
        sdl.configs.typescript,
        sdl.configs.required,
        es.configs['no-new-in-esnext'],
        js.configs.recommended,
        ts.configs['strict-type-checked'],
        ts.configs['stylistic-type-checked'],
        ban(GeneralBanList, ['eslint', '@typescript-eslint', '@stylistic/ts']),
        replace(EsTsReplaceList, ['eslint'], ['@typescript-eslint']),
        replace(EsStyleReplaceList, ['eslint', '@typescript-eslint'], ['@stylistic/ts']),
        replace(DeprecatedStyleList, ['eslint'], ['@stylistic/js']),
        {
            'redundant-undefined/redundant-undefined': 2,
            'deprecation/deprecation': 1,
            '@shopify/binary-assignment-parens': 0,
            '@shopify/class-property-semi': 0,
            '@typescript-eslint/array-type': [2, { default: 'array' }],
            '@typescript-eslint/consistent-type-exports': 2,
            '@typescript-eslint/consistent-type-imports': 0, // doesn't like dynamic imports
            '@typescript-eslint/explicit-function-return-type': 2,
            '@typescript-eslint/explicit-module-boundary-types': 2,
            '@typescript-eslint/max-params': 0,
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
            '@typescript-eslint/no-empty-interface': [2, { allowSingleExtends: true }],
            '@typescript-eslint/no-extraneous-class': 0,
            '@typescript-eslint/no-import-type-side-effects': 2,
            '@typescript-eslint/no-non-null-assertion': 0,
            '@typescript-eslint/no-this-alias': 0,
            '@typescript-eslint/no-unnecessary-qualifier': 0,
            '@typescript-eslint/no-unsafe-argument': 0,
            '@typescript-eslint/no-unsafe-assignment': 0,
            '@typescript-eslint/no-unsafe-call': 0,
            '@typescript-eslint/no-unsafe-member-access': 0,
            '@typescript-eslint/no-unsafe-unary-minus': 2,
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
            '@typescript-eslint/no-useless-empty-export': 2,
            '@typescript-eslint/prefer-regexp-exec': 2,
            '@typescript-eslint/no-var-requires': 2,
            '@typescript-eslint/prefer-find': 2,
            '@typescript-eslint/prefer-readonly': 2,
            '@typescript-eslint/prefer-string-starts-ends-with': 0,
            '@typescript-eslint/promise-function-async': 2,
            '@typescript-eslint/require-array-sort-compare': 2,
            '@typescript-eslint/restrict-template-expressions': 1,
            '@typescript-eslint/space-before-function-paren': [2, { named: 'never' }],
            '@typescript-eslint/strict-boolean-expressions': 0,
            '@typescript-eslint/switch-exhaustiveness-check': 2,
            '@typescript-eslint/type-annotation-spacing': 2,
            '@typescript-eslint/unbound-method': 0, // is against fp
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
            'unicorn/no-this-assignment': 0,
            'unicorn/prefer-ternary': 1,
            'unicorn/consistent-function-scoping': 0,
            'unicorn/no-empty-file': 1,
            'unicorn/no-useless-undefined': 0,
            'unicorn/text-encoding-identifier-case': 0, // some libraries define it differently
            'unicorn/no-array-method-this-argument': 0, // gets confused with same named methods
            'unicorn/no-await-expression-member': 0,
            'unicorn/expiring-todo-comments': 0,
            'unicorn/prefer-event-target': 0,
            'array-func/prefer-array-from': 0, // incredibly slow
            'import/export': 0, // broken and forgotten
            'import/no-cycle': 0,
            'import/no-named-as-default': 0,
            'regexp/strict': 0, // interferes with unicorn/better-regex
            'security/detect-object-injection': 0,
            'security/detect-non-literal-fs-filename': 0, // too many false positives
            'accessor-pairs': 0, // nonsensical rule for readonly or writeonly properties
            'arrow-body-style': 0,
            'consistent-this': 0,
            curly: 0,
            'default-case': 0, // unnecessary with strictly typed strings
            'default-case-last': 1,
            'func-style': 0,
            'function-paren-newline': 0,
            'generator-star-spacing': 0,
            'id-length': 0,
            'implicit-arrow-linebreak': 0,
            'line-comment-position': 0,
            'newline-per-chained-call': 0,
            'new-cap': 0, // sees () for type assertion as uppercase character
            'no-alert': 1,
            'no-case-declarations': 0,
            'no-console': 1,
            'no-control-regex': 0,
            'no-fallthrough': 0,
            'no-implicit-coercion': 0,
            'no-implicit-globals': 1,
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
            'prefer-arrow-callback': 0,
            'prefer-const': 2,
            'prefer-object-spread': 0,
            'spaced-comment': 0
        }
    ]
}

/**
 *   Array of basic eslint configs
 */
const base: PartialProfileConfig[] = [
    baseConfig,
    {
        extends: [ts.configs.disableTypeChecked],
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'script'
        }
    },
    {
        extends: [ts.configs.disableTypeChecked],
        files: ['**/*.cjs'],
        languageOptions: {
            sourceType: 'commonjs'
        }
    }
]
export default base
