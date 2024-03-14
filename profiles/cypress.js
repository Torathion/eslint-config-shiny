import cypress from 'eslint-plugin-cypress'

import { apply } from '../dist/index.js'

export default {
    files: ['**/*.cy.ts'],
    ...apply({ cypress })
}
