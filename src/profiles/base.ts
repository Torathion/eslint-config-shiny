import type { MaybeArray } from 'typestar'
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments'
import js from '@eslint/js'
import ts from '@typescript-eslint/eslint-plugin'
import arrayFunc from 'eslint-plugin-array-func'
import autofix from 'eslint-plugin-autofix'
import es from 'eslint-plugin-es-x'
import importPlugin from 'eslint-plugin-import'
import noSecrets from 'eslint-plugin-no-secrets'
import promise from 'eslint-plugin-promise'
import regexp from 'eslint-plugin-regexp'
import unicorn from 'eslint-plugin-unicorn'
import type { PartialProfileConfig, ProjectMetadata } from '../types/interfaces'

export default function base(metadata: ProjectMetadata): MaybeArray<PartialProfileConfig> {
    const baseConfig: PartialProfileConfig = {
        apply: {
            '@eslint-community/eslint-comments': eslintComments,
            'array-func': arrayFunc,
            promise,
            regexp,
            unicorn
        },
        extends: ['empty'],
        name: 'base',
        plugins: {
            autofix,
            'es-x': es,
            import: importPlugin,
            'no-secrets': noSecrets
        },
        rules: [
            es.configs['flat/no-new-in-esnext'],
            js.configs.recommended,
            importPlugin.flatConfigs.recommended,
            {
                'accessor-pairs': 0, // nonsensical rule for readonly or writeonly properties
                'array-func/prefer-array-from': 0, // incredibly slow
                'arrow-body-style': 2,
                'autofix/no-proto': 2,
                'autofix/no-prototype-builtins': 2,
                'autofix/no-useless-concat': 1,
                eqeqeq: 2,
                'guard-for-in': 2,
                'import/no-unresolved': 0,
                'import/order': 0,
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
                'no-promise-executor-return': 2,
                'no-return-assign': 2,
                'no-script-url': 2,
                'no-secrets/no-secrets': [2, { tolerance: 4.2 }],
                'no-sequences': 2,
                'no-template-curly-in-string': 1,
                'no-undef': 0, // NodeJS namespace is undefined
                'no-undef-init': 1,
                'no-underscore-dangle': 1,
                'no-unmodified-loop-condition': 2,
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
                'promise/no-multiple-resolved': 1,
                'promise/param-names': 0,
                'promise/prefer-await-to-then': 1,
                'promise/spec-only': 2,
                'regexp/strict': 2,
                'unicorn/catch-error-name': 0, // unnecessary
                'unicorn/custom-error-definition': 2,
                'unicorn/expiring-todo-comments': 0,
                'unicorn/explicit-length-check': 0, // makes the code longer
                'unicorn/filename-case': 0,
                'unicorn/import-style': 0, // wants default imports of node modules
                'unicorn/no-array-callback-reference': 0, // Makes reusing mappers impossible.
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
                'unicorn/prefer-math-min-max': 0, // Rewrites fast ternaries for slower Math functions
                'unicorn/prefer-math-trunc': 0, // bitwise is faster at smaller numbers
                'unicorn/prefer-modern-math-apis': 0, // Rewrites micro-optimized mathematical code with much slower code (e.g. Math.hypot).
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
        ]
    }

    if (!metadata.tsconfig) return baseConfig
    const disableTypeChecked = ts.configs['disable-type-checked']
    baseConfig.name = 'base-ts'
    baseConfig.plugins!.ts = ts
    baseConfig.rules = [
        ...baseConfig.rules!,
        ts.configs['strict-type-checked'],
        ts.configs['stylistic-type-checked'],
        {
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
            'ts/no-dynamic-delete': 0,
            'ts/no-import-type-side-effects': 2,
            'ts/no-loop-func': 2,
            'ts/no-misused-promises': [2, { checksVoidReturn: false }], // Fixes eslint errors for async html event handlers
            'ts/no-shadow': 2,
            'ts/no-this-alias': 0,
            'ts/no-unnecessary-condition': [2, { allowConstantLoopConditions: true }],
            'ts/no-unnecessary-parameter-property-assignment': 1,
            'ts/no-unnecessary-qualifier': 1,
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
            'ts/switch-exhaustiveness-check': 2,
            'ts/unbound-method': 0 // is against fp
        } as any
    ]
    return [
        baseConfig,
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
}
