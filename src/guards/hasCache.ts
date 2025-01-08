import type { ShinyConfig } from 'src/types/interfaces'
import { join } from 'node:path'
import { PathExistsState } from 'src/types'
import { pathExists } from 'src/utils'

/**
 *  Guard function checking whether a cache file exists or not.
 *
 *  @param opts - tool options
 *  @returns `true`, if a cache file exists, otherwise `false`.
 */
export default async function hasCache(opts: ShinyConfig): Promise<boolean> {
    return opts.cache && await pathExists(join(opts.root, '.temp', 'shiny-config.json')) == PathExistsState.File
}
