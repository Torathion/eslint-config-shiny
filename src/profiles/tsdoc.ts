import type { PartialProfileConfig } from '../types/interfaces'

import tsdoc from 'eslint-plugin-tsdoc'

export const config = {
    extends: ['empty'],
    name: 'tsdoc',
    plugins: {
        tsdoc
    },
    rules: [
        {
            'tsdoc/syntax': 1
        }
    ]
} as PartialProfileConfig
