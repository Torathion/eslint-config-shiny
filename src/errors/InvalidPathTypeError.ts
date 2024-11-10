export default class InvalidPathTypeError extends Error {
    readonly path: string

    constructor(path: string) {
        super(`The path "${path}" is neither a file nor a directory and therefore can not be processed.`)
        this.name = 'InvalidPathTypeError'
        this.path = path
    }
}
