import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'
import jestFormatting from 'eslint-plugin-jest-formatting'

import type { ProfileConfig } from '../types/interfaces'

export const config: Partial<ProfileConfig> = {
    extends: ['test-base'],
    apply: { jest, 'jest-dom': jestDom, 'jest-formatting': jestFormatting },
    settings: {
        jest: {
            version: 29
        }
    }
}