import testingLibrary from 'eslint-plugin-testing-library'

import browserTestingConfig from './browser-testing.js'

// Removes testing-library/dom config
browserTestingConfig.pop()

browserTestingConfig.push({
    plugins: {
        testingLibrary
    },
    rules: {
        ...testingLibrary.configs.react.rules
    }
})

export default browserTestingConfig
