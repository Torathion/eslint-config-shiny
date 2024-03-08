import storybook from 'eslint-plugin-storybook'
import testingLibrary from 'eslint-plugin-testing-library'

/**
 *   Array of basic browser testing eslint configs
 */
export default [
    {
        files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
        plugins: {
            storybook
        },
        rules: {
            ...storybook.configs.recommended.rules
        }
    },
    {
        files: ['test/**/*.test.ts', 'test/**/*.spec.ts', '**/*.test.ts', '**/*.spec.ts'],
        plugins: {
            'testing-library': testingLibrary
        },
        rules: {
            ...testingLibrary.configs.dom.rules
        }
    }
]
