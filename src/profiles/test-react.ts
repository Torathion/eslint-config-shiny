import testingLibrary from 'eslint-plugin-testing-library'

import type { PartialProfileConfig, ProfileConfig, ProjectMetadata } from '../types/interfaces.js'

export default function testReact(_metadata: ProjectMetadata): PartialProfileConfig {
    return {
        extends: ['test-web'],
        name: 'test-react',
        rules: [testingLibrary.configs.react.rules!]
    }
}
