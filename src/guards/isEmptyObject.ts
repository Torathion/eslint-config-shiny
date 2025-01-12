import type { AnyObject } from 'typestar'

export default function isEmptyObject(obj: AnyObject): boolean {
    for (const x in obj) return false
    return true
}
