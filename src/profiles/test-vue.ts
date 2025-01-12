import type { ProfileConfig } from '../types/interfaces'

import testingLibrary from 'eslint-plugin-testing-library'

export const config: Partial<ProfileConfig> = {
    extends: ['test-web'],
    name: 'test-vue',
    rules: [testingLibrary.configs.vue.rules, { 'testing-library/no-await-sync-events': 0 }]
}
