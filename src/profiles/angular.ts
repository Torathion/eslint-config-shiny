import globals from 'globals'
import ng from '@angular-eslint/eslint-plugin'
import ngTemplate from '@angular-eslint/eslint-plugin-template'
import ngParser from '@angular-eslint/template-parser'
import sdl from '@microsoft/eslint-plugin-sdl'

import type { PartialProfileConfig } from '../types/interfaces'

const config: PartialProfileConfig[] = [
    {
        apply: { '@angular-eslint': ng },
        extends: ['web'],
        languageOptions: {
            parserOptions: {
                project: ['tsconfig.json', 'tsconfig.spec.json']
            }
        },
        name: 'angular',
        plugins: {
            '@angular-eslint': ng,
            '@microsoft/sdl': sdl
        },
        rules: [sdl.configs.angular, { 'testing-library/no-await-sync-events': 0 }]
    },
    {
        apply: {
            '@angular-eslint/template': ngTemplate
        },
        files: ['**/*.html'],
        languageOptions: {
            parser: ngParser
        },
        name: 'angular-html',
        rules: [ngTemplate.configs.accessibility]
    },
    {
        files: ['**/*.spec.ts'],
        languageOptions: {
            globals: globals.jasmine
        },
        name: 'jasmine'
    }
]

export default config
