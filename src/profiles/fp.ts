import fp from 'eslint-plugin-functional'

import type { ProfileConfig } from '../types/interfaces'

export const config: Partial<ProfileConfig> = {
    apply: { functional: fp },
    extends: ['base'],
    name: 'fp'
}
