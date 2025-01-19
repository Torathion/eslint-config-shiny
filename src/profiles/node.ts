import sdl from '@microsoft/eslint-plugin-sdl'
import n from 'eslint-plugin-n'
import globals from 'globals'

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
            'n/callback-return': 1,
            'n/exports-style': [2, 'exports'],
            'n/no-missing-import': 0, // Doesn't like barrel files
            'n/no-new-require': 2,
            'n/no-path-concat': 2,
            'n/no-process-exit': 0,
            'n/no-unpublished-import': 0,
            'n/prefer-global/buffer': 2,
            'n/prefer-global/console': 2,
            'n/prefer-global/process': 2,
            'n/prefer-global/text-decoder': 2,
            'n/prefer-global/text-encoder': 2,
            'n/prefer-global/url': 2,
            'n/prefer-global/url-search-params': 2,
            'n/prefer-node-protocol': 1,
            'n/prefer-promises/dns': 1,
            'n/prefer-promises/fs': 1,
            'promise/avoid-new': 2,
            'sdl/no-unsafe-alloc': 2
        }
    ]
}
