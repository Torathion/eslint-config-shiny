export default class OpCancelledError extends Error {
    constructor() {
        super('Process has been cancelled.')
        this.name = 'OperationCancelledError'
    }
}
