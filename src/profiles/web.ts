import globals from 'globals'
import compat from 'eslint-plugin-compat'
import ssr from 'eslint-plugin-ssr-friendly'

import type { PartialProfileConfig } from '../types/interfaces'

export const config: PartialProfileConfig = {
    apply: { compat, 'ssr-friendly': ssr },
    extends: ['base'],
    languageOptions: { globals: [globals.browser, globals.serviceworker] },
    name: 'web'
}
