import { type FileHandle, open } from 'node:fs/promises'
import { cwd } from 'src/constants'
import type { PartialProfileConfig } from 'src/types/interfaces'

export default async function parseGitignore(): Promise<PartialProfileConfig> {
    let file: FileHandle
    const ignores: string[] = []
    try {
        file = await open(`${cwd}/.gitignore`, 'r')
    } catch (err) {
        return { ignores }
    }

    for await (const pattern of file.readLines()) {
        // ignore comments and empty lines
        if (!pattern.length || pattern[0] === '#') continue
        // these are files and don't need a trailing sub directory glob
        if (pattern[0] === '*' && pattern[1] === '.') ignores.push(pattern, `**/${pattern}`)
        else ignores.push(pattern, pattern[0] === '!' || pattern[0] === '/' ? `${pattern}/**` : `**/${pattern}/**`)
    }
    await file.close()
    return { ignores: [...new Set(ignores)] }
}
