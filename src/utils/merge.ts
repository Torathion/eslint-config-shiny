export default function merge(...arr: Record<string, unknown>[]): Record<string, unknown> {
    return Object.assign({}, ...arr)
}
