import type { Linter } from 'eslint'
import type { ShinyConfig } from 'src/types/interfaces'

export default async function getConfigs(opts: ShinyConfig): Promise<Linter.FlatConfig> {}
