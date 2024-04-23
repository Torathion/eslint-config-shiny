import { fdir } from 'fdir'

import type { PartialProfileConfig, ShinyConfig } from 'src/types/interfaces'

export default async function findTSConfigs(opts: ShinyConfig): Promise<PartialProfileConfig> {
    const api = new fdir().withFullPaths().withMaxDepth(1).crawl(opts.root)
    const files = await api.withPromise()
    const length = files.length
    const tsconfigFiles: string[] = []
    let file: string
    for (let i = 0; i < length; i++) {
        file = files[i]
        if (file.includes('tsconfig') && file.includes('json')) tsconfigFiles.push(file)
    }
    return {
        name: 'tsconfig-resolve',
        languageOptions: {
            parserOptions: {
                project: tsconfigFiles
            }
        }
    }
}
