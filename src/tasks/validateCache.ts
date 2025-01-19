import { open } from 'node:fs/promises'
import type { DisplayManager } from 'src/handler'
import type { Cache, ProjectMetadata, ShinyConfig } from 'src/types'
import semver from 'semver'
import { GlobalPJStore } from 'src/constants'
import { fileToJson } from 'src/utils'

export default async function validateCache(metadata: ProjectMetadata, display: DisplayManager<ShinyConfig>): Promise<Cache | undefined> {
    const file = await open(metadata.cachePath, 'r')
    const cache: Cache = await fileToJson(file)
    await file.close()
    const version = semver.coerce(cache.version)
    const currentVersion = (await GlobalPJStore.getCurrentPackage()).version
    if (!semver.valid(version) || !cache.data) {
        display.warn('malformedCache')
        return undefined
    }
    if (!version || semver.lt(version, currentVersion)) {
        display.warn('outdatedCache')
        return undefined
    }
    return cache
}
