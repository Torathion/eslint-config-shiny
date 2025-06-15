import type { ShinyConfig } from 'src/types'

/**
 *  Guard function handling the edge case of the tool unable to find any rules to lint with.
 *
 *  @param opts - tool options
 *  @returns `true`, if the tool can't find any rules anywhere, otherwise `false`.
 */
export default function hasNoRules(opts: ShinyConfig): boolean {
  return !opts.apply && !opts.externalConfigs && !opts.configs.length
}
