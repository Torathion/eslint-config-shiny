import globals from 'globals'

import compat from 'eslint-plugin-compat'
import ssr from 'eslint-plugin-ssr-friendly'

import { base, baseArray } from './base.js'
import { apply, merge, mergeRules } from '../dist/index.js'

const appliedConfig = apply({ compat, 'ssr-friendly': ssr })

export const webConfig = {
    ...base,
    plugins: merge(base.plugins, appliedConfig.plugins),
    rules: mergeRules(base, appliedConfig)
}

webConfig.languageOptions.globals = merge(globals.browser, globals.serviceworker, base.languageOptions.globals)

export default [...baseArray, webConfig]
