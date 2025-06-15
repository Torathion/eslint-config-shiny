import type { DeepPartial } from 'typestar'

import testingLibrary from 'eslint-plugin-testing-library'
import type { ProfileConfig, ProjectMetadata } from '../types/interfaces.js'

export default function testReact(_metadata: ProjectMetadata): DeepPartial<ProfileConfig> {
  return {
    extends: ['test-web'],
    name: 'test-react',
    rules: [testingLibrary.configs['flat/react']]
  }
}
