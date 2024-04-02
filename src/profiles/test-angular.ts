import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig } from '../types/interfaces'

const testAngular: Partial<ProfileConfig> = {
    extends: ['test-web'],
    rules: [testingLibrary.configs.angular.rules]
}

export default testAngular
