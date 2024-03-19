import fp from 'eslint-plugin-functional'

import { base, baseArray } from './base.js'

import { mergeRules } from '../dist/index.js'

const fpConfig = {
    ...base,
    plugins: {
        ...base.plugins,
        functional: fp
    },
    rules: mergeRules(base, fp.configs.recommended)
}

export default [...baseArray, fpConfig]
