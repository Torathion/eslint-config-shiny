import type { Config, Rules } from './types'
import isConfig from './utils/isConfig'

export default function mergeRules(...rules: (Config | Rules)[]): Rules {
    const len = rules.length
    const arr: Rules[] = new Array(len)
    let config: Config | Rules
    for (let i = len - 1; i >= 0; i--) {
        config = rules[i]
        arr[i] = isConfig(config) ? config.rules : config
    }
    return Object.assign({}, ...arr)
}
