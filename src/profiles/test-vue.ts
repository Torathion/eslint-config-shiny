import testingLibrary from 'eslint-plugin-testing-library'

import type { ProjectMetadata } from '../types/interfaces'

export default function testVue(_metadata: ProjectMetadata) {
    return {
        extends: ['test-web'],
        name: 'test-vue',
        rules: [testingLibrary.configs.vue.rules!, { 'testing-library/no-await-sync-events': 0 }]
    }
}
