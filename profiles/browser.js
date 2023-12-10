import globals from 'globals'

import compat from 'eslint-plugin-compat'
import ssr from 'eslint-plugin-ssr-friendly'

import baseConfig, { base } from './base.js'

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
        ...compat.configs.recommended.rules,
        ...ssr.configs.recommended.rules,
        ...base.rules
    }
}

baseConfig.pop()

baseConfig.push(webConfig)

export default baseConfig
