export default class InactiveDisplayError extends Error {
    constructor() {
        super('No active branch for the DisplayManager was set.')
        this.name = 'InactiveDisplayError'
    }
}
