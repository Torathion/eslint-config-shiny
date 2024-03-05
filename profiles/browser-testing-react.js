import testingLibrary from 'eslint-plugin-testing-library'

import browserTestingConfig from './browser-testing.js'

const testingLibraryConfig = {
    plugins: {
        testingLibrary
    },
    rules: {
        ...testingLibrary.configs.react.rules
    }
}

export default [...browserTestingConfig, testingLibraryConfig]
