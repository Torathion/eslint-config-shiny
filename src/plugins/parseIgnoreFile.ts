import { type FileHandle, open } from 'node:fs/promises'

import { cwd } from 'src/constants'
import type { PartialProfileConfig } from 'src/types/interfaces'

export default async function parseIgnoreFile(fileName: string): Promise<PartialProfileConfig> {
    let file: FileHandle
    const ignores: string[] = []
    try {
        file = await open(`${cwd}/${fileName}`, 'r')
    } catch {
        return { name: `parse-${fileName}`, ignores }
    }

    for await (const pattern of file.readLines()) {
        // ignore comments and empty lines
        if (!pattern.length || pattern[0] === '#') continue
        // these are files and don't need a trailing sub directory glob
        if (pattern[0] === '*' && pattern[1] === '.') ignores.push(pattern, `**/${pattern}`)
        else ignores.push(pattern, pattern[0] === '!' || pattern[0] === '/' ? `${pattern}/**` : `**/${pattern}/**`)
    }
    await file.close()
    return { name: `parse-${fileName}`, ignores: [...new Set(ignores)] }
}
