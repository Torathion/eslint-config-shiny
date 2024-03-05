import fp from 'eslint-plugin-functional'

import { base, baseArray } from './base.js'

const fpConfig = {
    ...base,
    plugins: {
        ...base.plugins,
        functional: fp
    },
    rules: {
        ...base.rules,
        ...fp.configs.recommended.rules
    }
}

export default [...baseArray, fpConfig]
