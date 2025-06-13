import testingLibrary from 'eslint-plugin-testing-library'

import type { ProjectMetadata } from '../types/interfaces'

export default function testVue(_metadata: ProjectMetadata) {
    return {
        extends: ['test-web'],
        name: 'test-vue',
        rules: [testingLibrary.configs['flat/vue'], { 'testing-library/no-await-sync-events': 0 }]
    }
}
