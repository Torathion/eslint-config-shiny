import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'
import jestFormatting from 'eslint-plugin-jest-formatting'

import type { ProfileConfig, ProjectMetadata } from '../types/interfaces'
import type { DeepPartial } from 'typestar'

export default function jestConfig(_metadata: ProjectMetadata): DeepPartial<ProfileConfig> {
    return {
        apply: { jest, 'jest-dom': jestDom, 'jest-formatting': jestFormatting },
        extends: ['test-base'],
        name: 'jest',
        settings: {
            jest: {
                version: 29
            }
        }
    }
}
