export default function ensureArray<T>(value: T | T[]): NonNullable<T>[] {
    if (!value) return []
    return (Array.isArray(value) ? value : [value]) as any
}
