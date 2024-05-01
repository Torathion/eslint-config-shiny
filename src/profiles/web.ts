import globals from 'globals'
import compat from 'eslint-plugin-compat'
import ssr from 'eslint-plugin-ssr-friendly'
import sdl from '@microsoft/eslint-plugin-sdl'

import type { PartialProfileConfig } from '../types/interfaces'

const ConfusingBrowserGlobals = [
    'addEventListener',
    'blur',
    'close',
    'closed',
    'confirm',
    'defaultStatus',
    'defaultstatus',
    'event',
    'external',
    'find',
    'focus',
    'frameElement',
    'frames',
    'history',
    'innerHeight',
    'innerWidth',
    'length',
    'location',
    'locationbar',
    'menubar',
    'moveBy',
    'moveTo',
    'name',
    'onblur',
    'onerror',
    'onfocus',
    'onload',
    'onresize',
    'onunload',
    'open',
    'opener',
    'opera',
    'outerHeight',
    'outerWidth',
    'pageXOffset',
    'pageYOffset',
    'parent',
    'print',
    'removeEventListener',
    'resizeBy',
    'resizeTo',
    'screen',
    'screenLeft',
    'screenTop',
    'screenX',
    'screenY',
    'scroll',
    'scrollbars',
    'scrollBy',
    'scrollTo',
    'scrollX',
    'scrollY',
    'self',
    'status',
    'statusbar',
    'stop',
    'toolbar',
    'top'
]

export const config: PartialProfileConfig = {
    apply: { compat, sdl, 'ssr-friendly': ssr },
    extends: ['base'],
    languageOptions: { globals: [globals.browser, globals.serviceworker] },
    name: 'web',
    rules: [
        {
            'no-restricted-globals': [2, ...ConfusingBrowserGlobals],
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
