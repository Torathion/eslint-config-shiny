import fp from 'eslint-plugin-functional'
import { base, baseArray } from './base'
import { mergeRules } from 'src/tasks'
import type { ProfileConfig } from '../types/interfaces'

const fpConfig = {
    ...base,
    plugins: {
        ...base.plugins,
        functional: fp
    },
    rules: mergeRules(base, fp.configs!.recommended)
}

export default [...baseArray, fpConfig] as ProfileConfig[]
