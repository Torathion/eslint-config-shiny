import globals from 'globals'

import compat from 'eslint-plugin-compat'
import ssr from 'eslint-plugin-ssr-friendly'

import { apply, mergeRules } from '../tasks'
import merge from 'src/utils/merge'
import { base, baseArray } from './base'
import type { ESLint } from 'eslint'

const appliedConfig = apply({ compat, 'ssr-friendly': ssr })

export const webConfig = {
    ...base,
    plugins: merge(base.plugins, appliedConfig.plugins),
    rules: mergeRules(base, appliedConfig)
}

webConfig.languageOptions!.globals = merge(globals.browser, globals.serviceworker, base.languageOptions!.globals!) as ESLint.Globals

export default [...baseArray, webConfig]
