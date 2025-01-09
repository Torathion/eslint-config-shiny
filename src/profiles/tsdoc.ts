import type { PartialProfileConfig } from '../types/interfaces'

import tsdoc from 'eslint-plugin-tsdoc'

export const config = {
    name: 'tsdoc',
    plugins: {
        tsdoc
    },
    extends: ['empty'],
    rules: [
        {
            'tsdoc/syntax': 1
        }
    ]
} as PartialProfileConfig
