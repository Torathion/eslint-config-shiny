import type { ProfileConfig } from '../types/interfaces'
import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'

import jestFormatting from 'eslint-plugin-jest-formatting'

export const config: Partial<ProfileConfig> = {
    apply: { jest, 'jest-dom': jestDom, 'jest-formatting': jestFormatting },
    extends: ['test-base'],
    name: 'jest',
    settings: {
        jest: {
            version: 29
        }
    }
}
