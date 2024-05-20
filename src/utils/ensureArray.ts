import type { MaybeArray } from 'src/types/types'

export default function ensureArray<T>(value: MaybeArray<T>): NonNullable<T>[] {
    if (!value) return []
    return (Array.isArray(value) ? value.slice() : [value]) as any
}
