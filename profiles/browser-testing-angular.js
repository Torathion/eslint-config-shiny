import testingLibrary from 'eslint-plugin-testing-library'

import browserTestingConfig from './browser-testing.js'

const testAngularConfig = {
    plugins: {
        testingLibrary
    },
    rules: {
        ...testingLibrary.configs.angular.rules
    }
}

export default [...browserTestingConfig, testAngularConfig]
