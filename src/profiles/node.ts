import globals from 'globals'

import n from 'eslint-plugin-n'

import type { ProfileConfig } from '../types/interfaces'

const nodeConfig: Partial<ProfileConfig> = {
    extends: ['base', n.configs['flat/recommended-script']],
    languageOptions: {
        globals: globals.node
    },
    rules: {
        'n/no-unsupported-features/es-syntax': 0, // currently has problems with dynamic imports
        'n/no-unsupported-features/es-builtins': 0,
        'n/no-unpublished-import': 0,
        'n/no-missing-import': 0 // use eslint-plugin-import instead
    }
}

export default nodeConfig
