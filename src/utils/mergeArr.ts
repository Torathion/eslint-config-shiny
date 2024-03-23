export default function mergeArr<T, U>(target: T[], source: U[] | readonly U[]): T[] {
    Array.prototype.push.apply(target, source as any)
    return target
}
