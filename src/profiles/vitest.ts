import vitest from 'eslint-plugin-vitest'

import testBase from './test-base'
import { mergeRules } from '../tasks'
import merge from '../utils/merge'
import type { ProfileConfig } from '../types/interfaces'

/**
 *   Single vitest config object
 */
export default {
    ...testBase,
    plugins: {
        ...testBase.plugins,
        vitest
    },
    rules: mergeRules(vitest.configs.recommended, testBase),
    languageOptions: {
        globals: merge(testBase.globals, vitest.environments.env.globals)
    }
} as ProfileConfig
