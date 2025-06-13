import testingLibrary from 'eslint-plugin-testing-library'

import type { ProfileConfig, ProjectMetadata } from '../types/interfaces.js'
import type { DeepPartial } from 'typestar'

export default function testReact(_metadata: ProjectMetadata): DeepPartial<ProfileConfig> {
    return {
        extends: ['test-web'],
        name: 'test-react',
        rules: [testingLibrary.configs['flat/react']]
    }
}
