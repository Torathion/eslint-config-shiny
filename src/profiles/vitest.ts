import type { DeepPartial } from 'typestar'

import vitest from '@vitest/eslint-plugin'
import type { ProfileConfig, ProjectMetadata } from '../types/interfaces'

/**
 *   Single vitest config object
 */
export default function vitestConfig(_metadata: ProjectMetadata): DeepPartial<ProfileConfig> {
  return {
    apply: { vitest },
    extends: ['test-base'],
    languageOptions: {
      globals: vitest.environments.env.globals
    },
    name: 'vitest'
  }
}
