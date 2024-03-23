export default function mergeArr<T, U>(target: T[], source: U[] | readonly U[]): void {
    Array.prototype.push.apply(target, source as any)
}
