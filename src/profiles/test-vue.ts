import type { DeepPartial } from 'typestar'

import testingLibrary from 'eslint-plugin-testing-library'
import type { ProfileConfig, ProjectMetadata } from '../types/interfaces'

export default function testVue(_metadata: ProjectMetadata): DeepPartial<ProfileConfig> {
  return {
    extends: ['test-web'],
    name: 'test-vue',
    rules: [testingLibrary.configs['flat/vue'], { 'testing-library/no-await-sync-events': 0 }]
  }
}
