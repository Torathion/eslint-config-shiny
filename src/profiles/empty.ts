import type { PartialProfileConfig, ProjectMetadata } from 'src/types'
import * as eslintrc from '@eslint/eslintrc'
import { parser } from 'typescript-eslint'

import globals from 'globals'
import { ExcludeGlobs, SrcGlob } from 'src/globs'

const JSExtensions = ['.js', '.cjs', '.mjs']
const TSExtensions = ['.ts', '.cts', '.mts']
const AllExtensions = [...JSExtensions, ...TSExtensions]

export default function empty(metadata: ProjectMetadata): PartialProfileConfig {
    return {
        files: [SrcGlob],
        ignores: [...ExcludeGlobs, ...metadata.ignoreFiles],
        languageOptions: {
            ecmaVersion: 'latest',
            globals: [globals.es2021, globals.commonjs, eslintrc.Legacy.environments.get('es2024').globals],
            parser,
            parserOptions: {
                ecmaVersion: 'latest',
                project: metadata.tsconfig,
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
}
