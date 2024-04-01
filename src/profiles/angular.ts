import globals from 'globals'

import ng from '@angular-eslint/eslint-plugin'
import ngTemplate from '@angular-eslint/eslint-plugin-template'
import ngParser from '@angular-eslint/template-parser'
import sdl from '@microsoft/eslint-plugin-sdl'

import type { ProfileConfig } from '../types/interfaces'
import mergeRules from '../tasks/mergeRules'

const angularConfig: Partial<ProfileConfig>[] = [
    {
        extends: ['web'],
        plugins: {
            '@angular-eslint': ng,
            '@microsoft/sdl': sdl
        },
        languageOptions: {
            parserOptions: {
                project: ['tsconfig.json', 'tsconfig.spec.json']
            }
        },
        rules: {
            ...mergeRules(sdl.configs.angular, ng.configs.recommended),
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
        rules: mergeRules(ngTemplate.configs.recommended, ngTemplate.configs.accessibility)
    },
    {
        files: ['**/*.spec.ts'],
        languageOptions: {
            globals: globals.jasmine
        }
    }
]

export default angularConfig
