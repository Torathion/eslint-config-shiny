import { join } from 'node:path'
import type { ProjectMetadata, ShinyConfig } from 'src/types'

export default function getProjectMetadata(opts: ShinyConfig): ProjectMetadata {
    return {
        cachePath: join(opts.root, '.temp', 'shiny-config.json')
    }
}
