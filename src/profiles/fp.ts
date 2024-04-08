import fp from 'eslint-plugin-functional'
import type { ProfileConfig } from '../types/interfaces'

export const config: Partial<ProfileConfig> = {
    extends: ['base'],
    apply: { functional: fp }
}
