import globals from 'globals'

import compat from 'eslint-plugin-compat'
import ssr from 'eslint-plugin-ssr-friendly'

import merge from 'src/utils/merge'
import type { ProfileConfig } from '../types/interfaces'

export const web: ProfileConfig = {
    extends: ['base'],
    apply: { compat, 'ssr-friendly': ssr }
}

web.languageOptions.globals = merge(globals.browser, globals.serviceworker)

export default web
