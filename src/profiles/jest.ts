import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'
import jestFormatting from 'eslint-plugin-jest-formatting'

import { apply, mergeRules } from '../tasks'
import { base } from './base'
import merge from 'src/utils/merge'
import type { ProfileConfig } from '../types/interfaces'
import { ESLint } from 'eslint'

const appliedConfig = apply({
    jest,
    'jest-dom': jestDom,
    'jest-formatting': jestFormatting
})

export default [
    {
        ...base,
        plugins: merge<ESLint.Plugin>(base.plugins, appliedConfig.plugins),
        rules: mergeRules(base, appliedConfig),
        settings: {
            jest: {
                version: 29
            }
        }
    }
] as ProfileConfig[]
