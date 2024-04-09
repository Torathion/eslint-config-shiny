import globals from 'globals'

import compat from 'eslint-plugin-compat'
import ssr from 'eslint-plugin-ssr-friendly'

import type { PartialProfileConfig } from '../types/interfaces'

export const config: PartialProfileConfig = {
    name: 'web',
    extends: ['base'],
    apply: { compat, 'ssr-friendly': ssr },
    languageOptions: { globals: [globals.browser, globals.serviceworker] }
}
