import vitest from 'eslint-plugin-vitest'

import { base } from './base.js'
import testBase from './test-base.js'

/**
 *   Single vitest config object
 */
export default {
    ...base,
    ...testBase,
    plugins: {
        ...testBase.plugins,
        ...base.plugins,
        vitest
    },
    rules: {
        ...vitest.configs.recommended.rules,
        ...base.rules,
        ...testBase.rules
    },
    languageOptions: {
        ...base.languageOptions,
        globals: {
            ...base.languageOptions.globals,
            ...vitest.environments.env.globals
        }
    }
}
