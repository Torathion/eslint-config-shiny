import type { PackageJson } from 'src/types'
import { fileToJson, openSafe } from 'src/utils'

export default class PackageJsonHandler {
    private readonly meta: Partial<PackageJson>
    name: string
    version: string
    description?: string
    private _entryFile?: string
    private _typesFolder?: string
    keywords?: string[]
    homepage?: string
    bugUrl?: string
    private deps?: string[]

    private constructor(meta: Partial<PackageJson>) {
        this.meta = meta
        this.name = meta.name!
        this.version = meta.version!
        this.description = meta.description
    }

    static async parse(path: string): Promise<PackageJsonHandler> {
        const file = await openSafe(path, 'r+')
        if (!file) throw new Error(`Couldn't find package.json file for path ${path}`)
        const content: Partial<PackageJson> = await fileToJson(file)
        await file.close()
        return new PackageJsonHandler(content)
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

    get dependencies(): string[] {
        if (this.deps) return this.deps
        return (this.deps = Object.keys(this.meta.dependencies ?? []))
    }

    isModule(): boolean {
        return this.meta.type === 'module'
    }

    isCJS(): boolean {
        return this.meta.type === 'commonjs'
    }
}
