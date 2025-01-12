import type { ProjectMetadata, ShinyConfig } from 'src/types'
import { join } from 'node:path'

export default function getProjectMetadata(opts: ShinyConfig): ProjectMetadata {
    return {
        cachePath: join(opts.root, '.temp', 'shiny-config.json')
    }
}
