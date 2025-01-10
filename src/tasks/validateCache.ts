import type { DisplayTaskHandler } from 'src/handler'
import type { Cache, ProjectMetadata, ShinyConfig } from 'src/types'
import { open } from 'node:fs/promises'
import semver from 'semver'
import { GlobalPJStore } from 'src/constants'
import { fileToJson } from 'src/utils'

export default async function validateCache(metadata: ProjectMetadata, display: DisplayTaskHandler<ShinyConfig>): Promise<Cache | undefined> {
    const file = await open(metadata.cachePath, 'r')
    const cache: Cache = await fileToJson(file)
    await file.close()
    const version = semver.coerce(cache.version)
    const currentVersion = (await GlobalPJStore.getCurrentPackage()).version
    if (!semver.valid(version) || !cache.data) {
        display.warn('Malformed cache file found. The config needs to be parsed again!')
        return undefined
    }
    if (!version || semver.lt(version, currentVersion)) {
        display.warn('Outdated cache file found. The config needs to be parsed again!')
        return undefined
    }
    return cache
}
