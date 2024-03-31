import tsdoc from 'eslint-plugin-tsdoc'
import type { ProfileConfig } from '../types/interfaces'

export default {
    plugins: {
        tsdoc
    },
    rules: {
        'tsdoc/syntax': 1
    }
} as Partial<ProfileConfig>
