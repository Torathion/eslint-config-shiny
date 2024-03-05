import globals from 'globals'

import compat from 'eslint-plugin-compat'
import ssr from 'eslint-plugin-ssr-friendly'

import { base, baseArray } from './base.js'

export const webConfig = {
    ...base,
    plugins: {
        ...base.plugins,
        compat,
        'ssr-friendly': ssr
    },
    languageOptions: {
        ...base.languageOptions,
        globals: {
            ...globals.browser,
            ...globals.serviceworker,
            ...base.languageOptions.globals
        }
    },
    rules: {
        ...base.rules,
        ...compat.configs.recommended.rules,
        ...ssr.configs.recommended.rules
    }
}

export default [...baseArray, webConfig]
