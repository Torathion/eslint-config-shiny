import testingLibrary from 'eslint-plugin-testing-library'

import browserTestingConfig from './test-web.js'
import testBase from './test-base.js'
import type { ProfileConfig } from '../types/interfaces.js'

const testingLibraryConfig: ProfileConfig = {
    ...testBase,
    plugins: {
        'testing-library': testingLibrary
    },
    rules: testingLibrary.configs.react.rules
}

export default [...browserTestingConfig, testingLibraryConfig]
