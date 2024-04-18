export default function isEmptyObject(obj: Record<string, unknown>): boolean {
    for (const x in obj) return false
    return true
}
