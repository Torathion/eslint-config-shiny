import json from 'eslint-plugin-json'
import jsonFiles from 'eslint-plugin-json-files'

import type { PartialProfileConfig } from '../types/interfaces'

const config: PartialProfileConfig = {
    apply: { json },
    files: ['**/*.json'],
    name: 'json',
    plugins: {
        'json-files': jsonFiles
    },
    rules: [
        {
            'json-files/validate-schema': 0
        }
    ]
}

export default config
