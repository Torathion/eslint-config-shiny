import cypress from 'eslint-plugin-cypress'

import { apply } from '../tasks'

export default {
    files: ['**/*.cy.ts'],
    ...apply({ cypress })
}
