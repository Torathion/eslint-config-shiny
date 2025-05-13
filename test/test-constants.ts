import { Profile, ShinyConfig } from '..'

export const DefaultTestOptions: Partial<ShinyConfig> = {
    silent: true,
    cache: false
}

export const Profiles: Profile[] = [
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
]
