import type { Config } from '../types'

export default function isConfig(obj: Record<string, any>): obj is Config {
    return Object.hasOwn(obj, 'rules') || Object.hasOwn(obj, 'plugins')
}
