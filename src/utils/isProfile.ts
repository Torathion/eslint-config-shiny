import type { Profile } from 'src/types/types'

const Profiles = [
    'angular',
    'web',
    'cypress',
    'format',
    'fp',
    'jest',
    'json',
    'node',
    'react',
    'base',
    'test-base',
    'test-angular',
    'test-web',
    'test-react',
    'test-vue',
    'tsdoc',
    'vitest',
    'vue'
]

export default function isProfile(value: string): value is Profile {
    return Profiles.includes(value)
}
