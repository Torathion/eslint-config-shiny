import globals from 'globals'

import ng from '@angular-eslint/eslint-plugin'
import ngTemplate from '@angular-eslint/eslint-plugin-template'
import ngParser from '@angular-eslint/template-parser'
import sdl from '@microsoft/eslint-plugin-sdl'

import type { PartialProfileConfig } from '../types/interfaces'

const config: PartialProfileConfig[] = [
    {
        name: 'angular',
        extends: ['web'],
        apply: { '@angular-eslint': ng },
        plugins: {
            '@angular-eslint': ng,
            '@microsoft/sdl': sdl
        },
        languageOptions: {
            parserOptions: {
                project: ['tsconfig.json', 'tsconfig.spec.json']
            }
        },
        rules: [sdl.configs.angular, { 'testing-library/no-await-sync-events': 0 }]
    },
    {
        name: 'angular-html',
        files: ['**/*.html'],
        apply: {
            '@angular-eslint/template': ngTemplate
        },
        languageOptions: {
            parser: ngParser
        },
        rules: [ngTemplate.configs.accessibility]
    },
    {
        name: 'jasmine',
        files: ['**/*.spec.ts'],
        languageOptions: {
            globals: globals.jasmine
        }
    }
]

export default config
