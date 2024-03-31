import globals from 'globals'

import n from 'eslint-plugin-n'

import merge from '../utils/merge'
import { base, baseArray } from './base'
import type { ESLint } from 'eslint'

const nodeConfig = [
    n.configs['flat/recommended-script'],
    {
        ...base,
        rules: {
            ...base.rules,
            'n/no-unsupported-features/es-syntax': 0, // currently has problems with dynamic imports
            'n/no-unsupported-features/es-builtins': 0,
            'n/no-unpublished-import': 0,
            'n/no-missing-import': 0 // use eslint-plugin-import instead
        }
    }
]

nodeConfig.languageOptions!.globals = merge(base.languageOptions!.globals!, globals.node) as ESLint.Globals

export default [...baseArray, ...nodeConfig]
