import { type FileHandle, open } from 'node:fs/promises'
import { join } from 'node:path'
import type { PartialProfileConfig } from 'src/types/interfaces'

export default async function parseIgnoreFile(root: string, fileName: string): Promise<PartialProfileConfig> {
    let file: FileHandle
    const ignores: string[] = []
    try {
        file = await open(join(root, fileName), 'r')
    } catch {
        return { ignores, name: `parse-${fileName}` }
    }

    for await (const pattern of file.readLines()) {
        // ignore comments and empty lines
        if (!pattern.length || pattern[0] === '#') continue
        // these are files and don't need a trailing sub directory glob
        if (pattern[0] === '*' && pattern[1] === '.') ignores.push(pattern, `**/${pattern}`)
        else ignores.push(pattern, pattern[0] === '!' || pattern[0] === '/' ? `${pattern}/**` : `**/${pattern}/**`)
    }
    await file.close()
    return { ignores: [...new Set(ignores)], name: `parse-${fileName}` }
}
