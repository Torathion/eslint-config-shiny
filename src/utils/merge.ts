export default function merge<T>(...arr: Record<string, T>[]): Record<string, T> {
    return Object.assign({}, ...arr)
}
