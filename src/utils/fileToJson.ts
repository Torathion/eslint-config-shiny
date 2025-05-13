import type { FileHandle } from 'node:fs/promises'
import { parseJson } from 'compresso'
import stripComments from 'strip-json-comments'

export default async function fileToJson(file: FileHandle): Promise<any> {
    return parseJson(stripComments((await file.readFile()).toString()))
}
