import testingLibrary from 'eslint-plugin-testing-library'

import browserTestingConfig from './browser-testing.js'
import testBase from './test-base'
import type { ProfileConfig } from '../types/interfaces'

const testingLibraryConfig: ProfileConfig = {
    ...testBase,
    plugins: {
        'testing-library': testingLibrary
    },
    rules: testingLibrary.configs.react.rules
}

export default [...browserTestingConfig, testingLibraryConfig]
