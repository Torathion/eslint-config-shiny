import type { Config, ShinyConfig } from '../types'
import type { Linter } from 'eslint'

export default async function getConfigs(opts: ShinyConfig): Promise<Linter.FlatConfig> {}
