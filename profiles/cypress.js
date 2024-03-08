import cypress from 'eslint-plugin-cypress'

export default {
    files: ['**/*.cy.ts'],
    plugins: {
        cypress
    },
    rules: {
        ...cypress.configs.recommended.rules
    }
}
