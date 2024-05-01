import globals from 'globals'
import n from 'eslint-plugin-n'
import sdl from '@microsoft/eslint-plugin-sdl'

import type { PartialProfileConfig } from '../types/interfaces'

export const config: PartialProfileConfig = {
    extends: ['base', n.configs['flat/recommended-module']],
    languageOptions: {
        globals: globals.node
    },
    name: 'node',
    plugins: { sdl },
    rules: [
        {
            'n/callback-return': 0,
            'n/exports-style': [2, 'exports'],
            'n/no-missing-import': 0, // use eslint-plugin-import instead
            'n/no-new-require': 2,
            'n/no-path-concat': 2,
            'n/no-unpublished-import': 0,
            'n/prefer-global/buffer': 2,
            'n/prefer-global/console': 2,
            'n/prefer-global/process': 2,
            'n/prefer-global/text-decoder': 2,
            'n/prefer-global/text-encoder': 2,
            'n/prefer-global/url': 2,
            'n/prefer-global/url-search-params': 2,
            'n/prefer-promises/dns': 1,
            'n/prefer-promises/fs': 1,
            'sdl/no-unsafe-alloc': 2
        }
    ]
}
