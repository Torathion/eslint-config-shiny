import type { ProfileConfig } from '../types/interfaces.js'

import testingLibrary from 'eslint-plugin-testing-library'

export const config: Partial<ProfileConfig> = {
    extends: ['test-web'],
    name: 'test-react',
    rules: [testingLibrary.configs.react.rules]
}
