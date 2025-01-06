import type { MaybeArray } from 'typestar'

export default function ensureArray<T>(value: MaybeArray<T>): NonNullable<T>[] {
    if (!value) return []
    return (Array.isArray(value) ? value.slice() : [value]) as any
}
