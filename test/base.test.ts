import { describe, expect, it } from 'vitest'
import shiny from '..'
import { DefaultTestOptions } from './test-constants'

describe('basic tests', () => {
    it('should work', async () => {
        expect(true).toBe(true)
        await expect(async () => await shiny(DefaultTestOptions)).not.toThrow()

        const output = await shiny(DefaultTestOptions)
        expect(output).toBeDefined()
        expect(output).not.toEqual({})
        expect(output).not.toEqual([])
    })
})
