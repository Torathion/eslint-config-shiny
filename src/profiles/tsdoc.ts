import type { DeepPartial } from 'typestar'

import tsdoc from 'eslint-plugin-tsdoc'
import type { ProfileConfig, ProjectMetadata } from '../types/interfaces'

export default function tsdocConfig(_metadata: ProjectMetadata): DeepPartial<ProfileConfig> {
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
