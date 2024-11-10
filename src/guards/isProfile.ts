import type { Profile } from 'src/types/types'

const Profiles = new Set([
    'web',
    'format',
    'jest',
    'node',
    'react',
    'base',
    'test-base',
    'test-web',
    'test-react',
    'test-vue',
    'tsdoc',
    'vitest',
    'vue'
])

export default function isProfile(value: string): value is Profile {
    return Profiles.has(value)
}
