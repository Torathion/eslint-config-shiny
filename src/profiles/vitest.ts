import vitest from 'eslint-plugin-vitest'

import type { PartialProfileConfig } from '../types/interfaces'

/**
 *   Single vitest config object
 */
export const config: PartialProfileConfig = {
    extends: ['test-base'],
    apply: { vitest },
    languageOptions: {
        globals: vitest.environments.env.globals
    }
}
