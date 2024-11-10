export default class PathNotFoundError extends Error {
    readonly path: string

    constructor(path: string) {
        super(`Path ${path} does not exist.`)
        this.name = 'PathNotFoundError'
        this.path = path
    }
}
