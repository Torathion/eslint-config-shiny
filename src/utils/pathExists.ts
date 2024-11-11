import type { PathExistsState } from 'src/types/enums'
import { access, stat } from 'node:fs/promises'

export default async function pathExists(path: string): Promise<PathExistsState> {
    try {
        await access(path)
        const stats = await stat(path)
        if (stats.isFile()) return 1
        if (stats.isDirectory()) return 2
        return 3
    } catch {
        return 0
    }
}
