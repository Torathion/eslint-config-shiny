import vitest from 'eslint-plugin-vitest'

import { base } from './base.js'

/**
 *   Single vitest config object
 */
export default {
    ...base,
    files: ['test/**/*.test.ts', 'test/**/*.spec.ts', '**/*.test.ts', '**/*.spec.ts'],
    plugins: {
        ...base.plugins,
        vitest
    },
    rules: {
        ...vitest.configs.recommended.rules,
        ...base.rules
    },
    languageOptions: {
        ...base.languageOptions,
        globals: {
            ...base.languageOptions.globals,
            ...vitest.environments.env.globals
        }
    }
}
