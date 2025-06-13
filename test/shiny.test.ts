import type { MaybeArray } from 'typestar'
import { describe, expect, it } from 'vitest'
import shiny from '..'
import { DefaultTestOptions, Profiles } from './test-constants'
import { FlatConfig } from '@typescript-eslint/utils/ts-eslint'

function shouldNotBeEmpty(output: MaybeArray<FlatConfig.Config>): void {
  expect(output).toBeDefined()
  expect(output).not.toEqual({})
  expect(output).not.toEqual([])
}

describe('basic tests', () => {
  it('should work', async () => {
    expect(true).toBe(true)
    await expect(async () => await shiny(DefaultTestOptions)).not.toThrow()

    shouldNotBeEmpty(await shiny(DefaultTestOptions))
  })

  it('should return empty array on no profiles', async () => {
    expect(await shiny({ ...DefaultTestOptions, configs: [] })).toEqual([])
  })

  it('should always have rules, plugins, settings and parser on default config', async () => {
    const output = await shiny(DefaultTestOptions)

    expect(Array.isArray(output)).toBe(true)

    const base = output[0]

    expect(Object.keys(base.rules!).length).toBeGreaterThan(0)
    expect(Object.keys(base.plugins!).length).toBeGreaterThan(0)
    expect(Object.keys(base.languageOptions!).length).toBeGreaterThan(0)
    expect(Object.keys(base.languageOptions!.parserOptions!).length).toBeGreaterThan(0)
  })

  it('can create profiles without issues', async () => {
    for (const profile of Profiles) {
      await expect(async () => await shiny({ configs: [profile], ...DefaultTestOptions })).not.toThrow()
    }
  })

  it('no profile should be empty', async () => {
    for (const profile of Profiles) {
      shouldNotBeEmpty(await shiny({ configs: [profile], ...DefaultTestOptions }))
      return
    }
  })
})
