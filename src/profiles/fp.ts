import fp from 'eslint-plugin-functional'
import type { ProfileConfig } from '../types/interfaces'

const fpConfig: Partial<ProfileConfig> = {
    extends: ['base'],
    apply: [{ functional: fp }]
}

export default fpConfig
