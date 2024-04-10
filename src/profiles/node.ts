import globals from 'globals'
import n from 'eslint-plugin-n'

import type { PartialProfileConfig } from '../types/interfaces'

export const config: PartialProfileConfig = {
    extends: ['base', n.configs['flat/recommended-script']],
    languageOptions: {
        globals: globals.node
    },
    name: 'node',
    rules: [
        {
            '@microsoft/sdl/no-unsafe-alloc': 2,
            'n/no-missing-import': 0, // use eslint-plugin-import instead
            'n/no-unpublished-import': 0,
            'n/no-unsupported-features/es-builtins': 0,
            'n/no-unsupported-features/es-syntax': 0, // currently has problems with dynamic imports
            'node/no-deprecated-api': 2
        }
    ]
}
