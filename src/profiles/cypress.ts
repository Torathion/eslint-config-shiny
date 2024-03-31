import cypress from 'eslint-plugin-cypress'

import { apply } from '../tasks'
import type { ProfileConfig } from '../types/interfaces'

export default {
    files: ['**/*.cy.ts'],
    ...apply({ cypress })
} as ProfileConfig
