import type { FileHandle } from 'fs/promises'

export default async function fileToJson(file: FileHandle): Promise<any> {
    return JSON.parse((await file.readFile()).toString())
}
