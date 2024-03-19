import vitest from 'eslint-plugin-vitest'

import testBase from './test-base.js'

import { merge, mergeRules } from '../dist/index.js'

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
}
