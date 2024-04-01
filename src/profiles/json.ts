import json from 'eslint-plugin-json'
import jsonFiles from 'eslint-plugin-json-files'
// import packageJson from 'eslint-plugin-package-json'
import jsoncParser from 'jsonc-eslint-parser'
import type { ProfileConfig } from '../types/interfaces'

export default [
    {
        files: ['package.json'],
        languageOptions: {
            parser: jsoncParser
        },
        plugins: {
            'json-files': jsonFiles
            //'package-json': packageJson
        },
        rules: {
            'json-files/ensure-repository-directory': 2,
            'json-files/require-engines': 2,
            'json-files/require-license': 2,
            'json-files/require-unique-dependency-names': 2
            // 'package-json/order-properties': 1,
            // 'package-json/prefer-repository-shorthand': 1,
            // 'package-json/sort-collections': 1,
            // 'package-json/unique-dependencies': 2,
            // 'package-json/valid-local-dependency': 2,
            // 'package-json/valid-name': 2,
            // 'package-json/valid-package-def': 2,
            // 'package-json/valid-repository-directory': 1,
            // 'package-json/valid-version': 2
        }
    },
    {
        files: ['*.json'],
        languageOptions: {
            parser: jsoncParser
        },
        plugins: {
            json,
            'json-files': jsonFiles
        },
        rules: {
            ...json.configs.recommended.rules,
            'json-files/validate-schema': 0
        }
    }
] as Partial<ProfileConfig>[]
