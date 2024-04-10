import cypress from 'eslint-plugin-cypress'

import type { ProfileConfig } from 'src/types/interfaces'

export const config = {
    apply: { cypress },
    files: ['**/*.cy.ts'],
    name: 'cypress'
} as Partial<ProfileConfig>
