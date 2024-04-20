import globals from 'globals'
import compat from 'eslint-plugin-compat'
import ssr from 'eslint-plugin-ssr-friendly'
import sdl from '@microsoft/eslint-plugin-sdl'

import type { PartialProfileConfig } from '../types/interfaces'

export const config: PartialProfileConfig = {
    apply: { compat, 'ssr-friendly': ssr, sdl },
    extends: ['base'],
    languageOptions: { globals: [globals.browser, globals.serviceworker] },
    name: 'web',
    rules: [
        {
            'sdl/no-cookies': 2,
            'sdl/no-document-domain': 2,
            'sdl/no-document-write': 2,
            'sdl/no-html-method': 2,
            'sdl/no-inner-html': 2,
            'sdl/no-insecure-url': 2,
            'sdl/no-msapp-exec-unsafe': 2,
            'sdl/no-postmessage-star-origin': 2,
            'sdl/no-winjs-html-unsafe': 2
        }
    ]
}
