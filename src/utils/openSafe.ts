import { open, type FileHandle } from 'node:fs/promises'

export default async function openSafe(path: string, flags: string): Promise<FileHandle | undefined> {
    try {
        return await open(path, flags)
    } catch {
        return undefined
    }
}
