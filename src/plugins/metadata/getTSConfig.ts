import type { ShinyConfig } from 'src/types/interfaces'

import { fdir } from 'fdir'

export default async function findTSConfigs(opts: ShinyConfig): Promise<string | undefined> {
  let file: string | undefined
  if (opts.tsconfigPath) return opts.tsconfigPath

  const api = new fdir().withFullPaths().withMaxDepth(1).crawl(opts.root)
  const files = await api.withPromise()
  const length = files.length
  for (let i = 0; i < length; i++) {
    file = files[i]
    if (file.includes('tsconfig') && file.includes('json')) break
  }

  return file
}
