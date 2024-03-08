import testingLibrary from 'eslint-plugin-testing-library'

import browserTestingConfig from './browser-testing.js'

const testingLibraryConfig = {
    plugins: {
        'testing-library': testingLibrary
    },
    rules: {
        ...testingLibrary.configs.vue.rules
    }
}

export default [...browserTestingConfig, testingLibraryConfig]