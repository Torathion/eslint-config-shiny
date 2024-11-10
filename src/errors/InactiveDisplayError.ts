export default class InactiveDisplayError extends Error {
    constructor() {
        super(`No active branch for the DisplayTaskHandler was set.`)
    }
}
