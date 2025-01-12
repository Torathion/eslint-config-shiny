import type { PartialProfileConfig, ShinyConfig } from 'src/types/interfaces'

import { fdir } from 'fdir'

export default async function findTSConfigs(opts: ShinyConfig): Promise<PartialProfileConfig> {
    let file: string | undefined
    let found = false
    if (opts.tsconfigPath) {
        file = opts.tsconfigPath
        found = true
    } else {
        const api = new fdir().withFullPaths().withMaxDepth(1).crawl(opts.root)
        const files = await api.withPromise()
        const length = files.length
        for (let i = 0; i < length; i++) {
            file = files[i]
            if (file.includes('tsconfig') && file.includes('json')) {
                found = true
                break
            }
        }
    }
    return {
        languageOptions: {
            parserOptions: {
                projectService: {
                    defaultProject: file && found ? file : 'tsconfig.json'
                }
            }
        },
        name: 'tsconfig-resolve'
    }
}
