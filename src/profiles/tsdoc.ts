import tsdoc from 'eslint-plugin-tsdoc'

import type { PartialProfileConfig, ProjectMetadata } from '../types/interfaces'

export default function tsdocConfig(_metadata: ProjectMetadata): PartialProfileConfig {
    return {
        extends: ['empty'],
        name: 'tsdoc',
        plugins: {
            tsdoc
        },
        rules: [
            {
                'tsdoc/syntax': 1
            }
        ]
    }
}
