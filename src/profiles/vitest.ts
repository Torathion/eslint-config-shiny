import vitest from 'eslint-plugin-vitest'

import type { ProfileConfig } from '../types/interfaces'

/**
 *   Single vitest config object
 */
const vitestConfig: Partial<ProfileConfig> = {
    extends: ['test-base'],
    apply: { vitest },
    languageOptions: {
        globals: vitest.environments.env.globals
    }
}

export default vitestConfig
