import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'
import jestFormatting from 'eslint-plugin-jest-formatting'

import { base } from './test-base.js'

import { apply, mergeRules } from '../dist/index.js'

const appliedConfig = apply({
    jest,
    'jest-dom': jestDom,
    'jest-formatting': jestFormatting
})

export default [
    {
        ...base,
        plugins: {
            ...base.plugins,
            ...appliedConfig.plugins
        },
        rules: mergeRules(base, appliedConfig),
        settings: {
            jest: {
                version: 29
            }
        }
    }
]
