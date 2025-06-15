import type { ShinyConfig } from 'src/types/interfaces'
import type { Profile } from 'src/types/types'

const baseConfigAndExtensions = new Set<Profile>(['base', 'node', 'react', 'test-base', 'test-react', 'test-vue', 'test-web', 'vue'])

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
