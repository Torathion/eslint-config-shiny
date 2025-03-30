import vitest from '@vitest/eslint-plugin'

import type { PartialProfileConfig, ProjectMetadata } from '../types/interfaces'

/**
 *   Single vitest config object
 */
export default function vitestConfig(_metadata: ProjectMetadata): PartialProfileConfig {
    return {
        apply: { vitest },
        extends: ['test-base'],
        languageOptions: {
            globals: vitest.environments.env.globals
        },
        name: 'vitest'
    }
}
