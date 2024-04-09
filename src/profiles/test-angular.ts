import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig } from '../types/interfaces'

export const config: Partial<ProfileConfig> = {
    name: 'test-angular',
    extends: ['test-web'],
    rules: [testingLibrary.configs.angular.rules]
}
