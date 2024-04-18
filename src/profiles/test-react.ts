import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig } from '../types/interfaces.js'

export const config: Partial<ProfileConfig> = {
    extends: ['test-web'],
    name: 'test-react',
    rules: [testingLibrary.configs.react.rules]
}
