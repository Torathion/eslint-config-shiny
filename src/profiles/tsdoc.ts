import tsdoc from 'eslint-plugin-tsdoc'
import type { PartialProfileConfig } from '../types/interfaces'

export const config = {
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
