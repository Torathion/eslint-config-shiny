export default class UnknownDisplayKeyError extends Error {
  constructor(key: string) {
    super(`Unknown key "${key}" has been passed to the DisplayManager.`)
    this.name = 'InactiveDisplayError'
  }
}
