import type { Profile } from 'src/types/types'

const Profiles = new Set([
  'base',
  'empty',
  'format',
  'jest',
  'node',
  'react',
  'test-base',
  'test-react',
  'test-vue',
  'test-web',
  'tsdoc',
  'vitest',
  'vue',
  'web'
])

export default function isProfile(value: string): value is Profile {
  return Profiles.has(value)
}
