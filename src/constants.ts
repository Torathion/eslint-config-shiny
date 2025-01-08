import { join } from 'node:path'
import PackageJsonStore from './handler/PackageJsonStore'

// Eslint rule option keywords to safe additional space.
export const NEVER = 'never'
export const ALWAYS = 'always'
export const FIELD = 'field'
export const METHOD = 'method'
// Prettier levels
export const WARN = 'warn'
// Project related
export const cwd = process.cwd()
export const GlobalPJStore = new PackageJsonStore()
// Known eslint constants
export const JsonProcessor = 'json/json'
