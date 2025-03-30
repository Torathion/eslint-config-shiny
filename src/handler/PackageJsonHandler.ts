import type { PackageJson } from 'typestar'
import { fileToJson } from 'src/utils'
import { safeGetFileHandle } from 'node-comb'

export default class PackageJsonHandler {
    private _entryFile?: string
    private _typesFolder?: string
    private deps?: string[]
    private readonly meta: Partial<PackageJson>
    bugUrl?: string
    description?: string
    homepage?: string
    keywords?: string[]
    name: string
    version: string

    private constructor(meta: Partial<PackageJson>) {
        this.meta = meta
        this.name = meta.name!
        this.version = meta.version!
        this.description = meta.description
    }

    isCJS(): boolean {
        return this.meta.type === 'commonjs'
    }

    isModule(): boolean {
        return this.meta.type === 'module'
    }

    static async parse(path: string): Promise<PackageJsonHandler> {
        const file = await safeGetFileHandle(path, 'r+')
        if (!file) throw new Error(`Couldn't find package.json file for path "${path}"!`)
        const content: Partial<PackageJson> = await fileToJson(file)
        await file.close()
        return new PackageJsonHandler(content)
    }

    get dependencies(): string[] {
        if (this.deps) return this.deps
        return (this.deps = Object.keys(this.meta.dependencies ?? []))
    }

    get entryFile(): string {
        if (this._entryFile) return this._entryFile
        const meta = this.meta
        return (this._entryFile = meta.main ?? meta.exports?.default ?? 'index.js')
    }

    get typesFolder(): string {
        if (this._typesFolder) return this._typesFolder
        const meta = this.meta
        return (this._typesFolder = meta.types ?? meta.exports?.types ?? 'index.d.ts')
    }
}
