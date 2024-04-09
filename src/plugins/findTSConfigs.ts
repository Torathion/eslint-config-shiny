import { fdir } from 'fdir'
import { cwd } from 'src/constants'
import type { PartialProfileConfig } from 'src/types/interfaces'

export default async function findTSConfigs(): Promise<PartialProfileConfig> {
    const api = new fdir().withFullPaths().withMaxDepth(1).crawl(cwd)
    const files = await api.withPromise()
    const length = files.length
    const tsconfigFiles: string[] = []
    let file: string
    for (let i = 0; i < length; i++) {
        file = files[i]
        if (file.includes('tsconfig') && file.includes('json')) tsconfigFiles.push(file)
    }
    return {
        languageOptions: {
            parserOptions: {
                project: tsconfigFiles
            }
        }
    }
}
