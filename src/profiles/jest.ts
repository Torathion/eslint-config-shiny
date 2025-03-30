import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'
import jestFormatting from 'eslint-plugin-jest-formatting'

import type { PartialProfileConfig, ProjectMetadata } from '../types/interfaces'

export default function jestConfig(_metadata: ProjectMetadata): PartialProfileConfig {
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
