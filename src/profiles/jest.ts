import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'
import jestFormatting from 'eslint-plugin-jest-formatting'

import type { ProfileConfig } from '../types/interfaces'

const jestConfig: Partial<ProfileConfig> = {
    extends: ['base'],
    apply: { jest, 'jest-dom': jestDom, 'jest-formatting': jestFormatting },
    settings: {
        jest: {
            version: 29
        }
    }
}
