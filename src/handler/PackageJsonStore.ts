import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cwd } from 'src/constants'
import PackageJsonHandler from './PackageJsonHandler'

export default class PackageJsonStore {
    private readonly handlers: Map<string, PackageJsonHandler>

    constructor() {
        this.handlers = new Map()
    }

    private async get(path: string): Promise<PackageJsonHandler> {
        const handlers = this.handlers
        if (handlers.has(path)) return handlers.get(path)!
        const pjHandler = await PackageJsonHandler.parse(path)
        handlers.set(path, pjHandler)
        return pjHandler
    }

    async getCurrentPackage(): Promise<PackageJsonHandler> {
        return this.get(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'))
    }

    async getCwd(): Promise<PackageJsonHandler> {
        return await this.get(join(cwd, 'package.json'))
    }

    async getModule(nodeModule: string): Promise<PackageJsonHandler> {
        try {
            return await this.get(resolve('node_modules', nodeModule, 'package.json'))
        } catch {
            throw new Error(`Couldn't find node module ${nodeModule}.`)
        }
    }
}
