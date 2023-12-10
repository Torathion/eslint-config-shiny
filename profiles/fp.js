import fp from 'eslint-plugin-functional'

import baseConfig, { base } from './base.js'

baseConfig.pop()

baseConfig.push({
    ...base,
    plugins: {
        ...base.plugins,
        functional: fp
    },
    rules: {
        ...base.rules,
        ...fp.configs.recommended.rules
    }
})

export default baseConfig
