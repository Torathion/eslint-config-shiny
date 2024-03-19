import globals from 'globals'

import compat from 'eslint-plugin-compat'
import ssr from 'eslint-plugin-ssr-friendly'

import { base, baseArray } from './base.js'
import { apply, mergeRules } from '../dist/index.js'

const appliedConfig = apply({ compat, 'ssr-friendly': ssr })

export const webConfig = {
    ...base,
    plugins: {
        ...base.plugins,
        ...appliedConfig.plugins
    },
    languageOptions: {
        ...base.languageOptions,
        globals: {
            ...globals.browser,
            ...globals.serviceworker,
            ...base.languageOptions.globals
        }
    },
    rules: mergeRules(base, appliedConfig)
}

export default [...baseArray, webConfig]
