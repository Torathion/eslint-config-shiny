import testingLibrary from 'eslint-plugin-testing-library'

import browserTestingConfig from './browser-testing'
import type { ProfileConfig } from '../types/interfaces'
import testBase from './test-base'

const testingLibraryConfig: ProfileConfig = {
    ...testBase,
    plugins: {
        'testing-library': testingLibrary
    },
    rules: {
        ...testingLibrary.configs.vue.rules,
        'testing-library/no-await-sync-events': 0
    }
}

export default [...browserTestingConfig, testingLibraryConfig]
