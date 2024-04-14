export default function isEmptyObject(obj: any): boolean {
    for (const x in obj) return false
    return true
}
