import { join } from 'node:path'
import type { ProjectMetadata, ShinyConfig } from 'src/types'
import getTSConfig from './getTSConfig'

export default async function getProjectMetadata(opts: ShinyConfig): Promise<ProjectMetadata> {
    return {
        tsconfig: await getTSConfig(opts),
        cachePath: join(opts.root, '.temp', 'shiny-config.json')
    }
}
