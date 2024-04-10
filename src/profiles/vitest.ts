import vitest from 'eslint-plugin-vitest'

import type { PartialProfileConfig } from '../types/interfaces'

/**
 *   Single vitest config object
 */
export const config: PartialProfileConfig = {
    apply: { vitest },
    extends: ['test-base'],
    languageOptions: {
        globals: vitest.environments.env.globals
    },
    name: 'vitest'
}
