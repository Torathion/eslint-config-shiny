import cypress from 'eslint-plugin-cypress'
import type { ProfileConfig } from 'src/types/interfaces'

export default {
    apply: { cypress },
    files: ['**/*.cy.ts']
} as Partial<ProfileConfig>
