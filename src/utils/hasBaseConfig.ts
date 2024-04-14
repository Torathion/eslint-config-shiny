import type { ShinyConfig } from 'src/types/interfaces'
import type { Profile } from 'src/types/types'

const baseConfigAndExtensions = new Set<Profile>([
    'base',
    'fp',
    'react',
    'vue',
    'angular',
    'node',
    'test-base',
    'test-angular',
    'test-react',
    'test-vue',
    'test-web'
])

export default function hasBaseConfig(opts: ShinyConfig): boolean {
    let flag = false
    for (let i = opts.configs.length - 1; i >= 0; i--) {
        if (baseConfigAndExtensions.has(opts.configs[i])) {
            flag = true
            break
        }
    }
    return flag
}
