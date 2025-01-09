import type { PartialProfileConfig } from 'src/types'
import * as eslintrc from '@eslint/eslintrc'
import tsParser from '@typescript-eslint/parser'

import globals from 'globals'
import { ExcludeGlobs, SrcGlob } from 'src/globs'

const JSExtensions = ['.js', '.cjs', '.mjs']
const TSExtensions = ['.ts', '.cts', '.mts']
const AllExtensions = [...JSExtensions, ...TSExtensions]

export const config: PartialProfileConfig = {
    files: [SrcGlob],
    ignores: ExcludeGlobs,
    languageOptions: {
        ecmaVersion: 'latest',
        globals: [globals.es2021, globals.commonjs, eslintrc.Legacy.environments.get('es2024').globals],
        parser: tsParser,
        parserOptions: {
            ecmaVersion: 'latest',
            projectService: {
                allowDefaultProject: ['./*.js']
            },
            sourceType: 'module'
        },
        sourceType: 'module'
    },
    linterOptions: {
        reportUnusedDisableDirectives: true
    },
    name: 'empty',
    plugins: {},
    rules: [],
    settings: {
        'import/extensions': AllExtensions,
        'import/external-module-folders': ['node_modules', 'node_modules/@types'],
        'import/ignore': ['node_modules'],
        'import/parsers': {
            '@typescript-eslint/parser': TSExtensions,
            espree: JSExtensions
        },
        'import/resolver': {
            node: {
                extensions: AllExtensions,
                resolvePaths: ['node_modules/@types']
            },
            typescript: true
        }
    }
}
