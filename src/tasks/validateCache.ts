import type { DisplayTaskHandler } from 'src/handler'
import type { Cache, ShinyConfig } from 'src/types'
import { open } from 'node:fs/promises'
import { join } from 'node:path'
import semver from 'semver'
import { GlobalPJStore } from 'src/constants'
import { fileToJson } from 'src/utils'

export default async function validateCache(opts: ShinyConfig, display: DisplayTaskHandler<ShinyConfig>): Promise<Cache | undefined> {
    const cacheFilePath = join(join(opts.root, '.temp'), 'shiny-config.json')
    const file = await open(cacheFilePath, 'r')
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
