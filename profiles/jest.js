import globals from 'globals'

import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'
import jestFormatting from 'eslint-plugin-jest-formatting'

import { base } from './base.js'

export default [
    {
        ...base,
        files: ['test/**/*.test.ts', 'test/**/*.spec.ts', '**/*.test.ts', '**/*.spec.ts'],
        plugins: {
            ...base.plugins,
            jest,
            'jest-dom': jestDom,
            'jest-formatting': jestFormatting
        },
        rules: {
            ...jest.configs.recommended.rules,
            ...jestDom.configs.recommended.rules,
            ...jestFormatting.configs.recommended.rules,
            ...base.rules
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
