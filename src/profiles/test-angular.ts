import testingLibrary from 'eslint-plugin-testing-library'

import browserTestingConfig from './test-web'
import type { ProfileConfig } from '../types/interfaces'
import testBase from './test-base'

const testAngularConfig: ProfileConfig = {
    ...testBase,
    plugins: {
        'testing-library': testingLibrary
    },
    rules: testingLibrary.configs.angular.rules
}

export default [...browserTestingConfig, testAngularConfig]
