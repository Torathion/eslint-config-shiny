import { existsSync } from 'fs'
import { join } from 'path'
import type { ShinyConfig } from 'src/types/interfaces'

// don't check for it multiple times
let cacheExists: boolean | undefined

export default function hasCache(opts: ShinyConfig): boolean {
    if (cacheExists !== undefined) return cacheExists
    cacheExists = opts.cache && existsSync(join(opts.root, '.temp', 'shiny-config.json'))
    return cacheExists
}
