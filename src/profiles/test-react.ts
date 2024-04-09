import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig } from '../types/interfaces.js'

export const config: Partial<ProfileConfig> = {
    name: 'test-react',
    extends: ['test-web'],
    rules: [testingLibrary.configs.react.rules]
}
