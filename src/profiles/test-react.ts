import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig } from '../types/interfaces.js'

const testReact: Partial<ProfileConfig> = {
    extends: ['test-web'],
    rules: [testingLibrary.configs.react.rules]
}

export default testReact
