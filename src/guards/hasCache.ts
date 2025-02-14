import type { ProjectMetadata, ShinyConfig } from 'src/types/interfaces'
import { PathExistsState } from 'src/types'
import { pathExists } from 'src/utils'

/**
 *  Guard function checking whether a cache file exists or not.
 *
 *  @param opts - tool options
 *  @returns `true`, if a cache file exists, otherwise `false`.
 */
export default async function hasCache(opts: ShinyConfig, metadata: ProjectMetadata): Promise<boolean> {
    return opts.cache && await pathExists(metadata.cachePath) === PathExistsState.File
}
