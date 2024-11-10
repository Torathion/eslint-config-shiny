import { basename, dirname, isAbsolute, join, parse } from 'node:path'
import { cwd as CWD } from 'src/constants'
import pathExists from './pathExists'
import { PathExistsState } from 'src/types/enums'
import { InvalidPathTypeError, PathNotFoundError } from 'src/errors'

async function findUp(fullPath: string, dir?: boolean): Promise<string> {
    const root = parse(fullPath).root
    const fileName = basename(fullPath)
    const checkState = dir ? PathExistsState.Dir : PathExistsState.File
    let state: PathExistsState | undefined
    let path = fullPath
    while (path !== root && state !== checkState) {
        path = dirname(path)
        state = await pathExists(join(path, fileName))
        if (state === PathExistsState.Unknown) throw new InvalidPathTypeError(fullPath)
    }
    if (state === undefined) throw new PathNotFoundError(fullPath)
    return join(path, fileName)
}

export default async function find(path: string, dir?: boolean, cwd = CWD): Promise<string> {
    const fullPath = isAbsolute(path) ? path : join(cwd, path)
    switch (await pathExists(fullPath)) {
        case PathExistsState.None:
            return await findUp(fullPath, dir)
        case PathExistsState.File:
        case PathExistsState.Dir:
            return fullPath
        case PathExistsState.Unknown:
            throw new InvalidPathTypeError(fullPath)
    }
}
