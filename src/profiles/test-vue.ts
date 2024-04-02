import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig } from '../types/interfaces'

const testVue: Partial<ProfileConfig> = {
    extends: ['test-web'],
    rules: [testingLibrary.configs.vue.rules, { 'testing-library/no-await-sync-events': 0 }]
}

export default testVue
