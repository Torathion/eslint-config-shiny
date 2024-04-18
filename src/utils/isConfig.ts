import type { ProfileConfig } from '../types/interfaces'

export default function isConfig(obj: Record<string, any>): obj is ProfileConfig {
    return Object.hasOwn(obj, 'rules') || Object.hasOwn(obj, 'plugins')
}
