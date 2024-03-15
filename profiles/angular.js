import globals from 'globals'

import ng from '@angular-eslint/eslint-plugin'
import ngTemplate from '@angular-eslint/eslint-plugin-template'
import ngParser from '@angular-eslint/template-parser'
import sdl from '@microsoft/eslint-plugin-sdl'

import { baseArray } from './base.js'
import { webConfig } from './browser.js'

const angularConfig = [
    {
        ...webConfig,
        plugins: {
            ...webConfig.plugins,
            '@angular-eslint': ng,
            '@microsoft/sdl': sdl
        },
        languageOptions: {
            ...webConfig.languageOptions,
            parserOptions: {
                ...webConfig.languageOptions.parserOptions,
                project: ['tsconfig.json', 'tsconfig.spec.json']
            }
        },
        rules: {
            ...webConfig.rules,
            ...sdl.configs.angular.rules,
            ...ng.configs.recommended.rules,
            'testing-library/no-await-sync-events': 0
        }
    },
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: ngParser
        },
        plugins: {
            '@angular-eslint/template': ngTemplate
        },
        rules: {
            ...ngTemplate.configs.recommended.rules,
            ...ngTemplate.configs.accessibility.rules
        }
    },
    {
        files: ['**/*.spec.ts'],
        languageOptions: {
            globals: {
                ...globals.jasmine
            }
        }
    }
]

export default [...baseArray, angularConfig]
