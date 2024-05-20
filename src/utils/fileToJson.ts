import type { FileHandle } from 'node:fs/promises'
import stripComments from 'strip-json-comments'

export default async function fileToJson(file: FileHandle): Promise<any> {
    return JSON.parse(stripComments((await file.readFile()).toString()))
}
