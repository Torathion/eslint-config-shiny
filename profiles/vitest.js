import vitest from 'eslint-plugin-vitest'

import testBase from './test-base.js'

/**
 *   Single vitest config object
 */
export default {
    ...testBase,
    plugins: {
        ...testBase.plugins,
        vitest
    },
    rules: {
        ...vitest.configs.recommended.rules,
        ...testBase.rules
    },
    languageOptions: {
        globals: {
            ...testBase.globals,
            ...vitest.environments.env.globals
        }
    }
}
