import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig } from '../types/interfaces'

export const config: Partial<ProfileConfig> = {
    extends: ['test-web'],
    name: 'test-angular',
    rules: [testingLibrary.configs.angular.rules]
}
