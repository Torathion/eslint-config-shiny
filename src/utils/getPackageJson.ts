import type { FileHandle } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import openSafe from './openSafe'

export default async function getPackageJson(): Promise<FileHandle | undefined> {
    return openSafe(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'r+')
}
