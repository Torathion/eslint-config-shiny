import globals from 'globals'

import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'
import jestFormatting from 'eslint-plugin-jest-formatting'

import { base } from './base.js'

import { apply } from '../dist/index.js'

const appliedConfig = apply({
    jest,
    'jest-dom': jestDom,
    'jest-formatting': jestFormatting
})

export default [
    {
        ...base,
        files: ['test/**/*.test.ts', 'test/**/*.spec.ts', '**/*.test.ts', '**/*.spec.ts'],
        plugins: {
            ...base.plugins,
            ...appliedConfig.plugins
        },
        rules: {
            ...base.rules,
            ...appliedConfig.rules
        },
        languageOptions: {
            ...base.languageOptions,
            globals: {
                ...base.languageOptions.globals,
                ...globals.jest
            }
        },
        settings: {
            jest: {
                version: 29
            }
        }
    }
]
