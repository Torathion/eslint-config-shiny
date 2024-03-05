import globals from 'globals'

import n from 'eslint-plugin-n'

import { base, baseArray } from './base.js'

const nodeConfig = [
    n.configs['flat/recommended-script'],
    {
        ...base,
        plugins: {
            ...base.plugins
        },
        rules: {
            ...base.rules,
            'n/no-unsupported-features/es-syntax': 0, // currently has problems with dynamic imports
            'n/no-unsupported-features/es-builtins': 0,
            'n/no-unpublished-import': 0,
            'n/no-missing-import': 0 // use eslint-plugin-import instead
        },
        languageOptions: {
            ...base.languageOptions,
            globals: {
                ...base.languageOptions.globals,
                ...globals.node
            }
        }
    }
]

export default [...baseArray, ...nodeConfig]
