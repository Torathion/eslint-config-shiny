import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint'
import type { PartialProfileConfig } from 'src/types'

export const config = (strict: boolean): PartialProfileConfig => {
  const value: SharedConfig.RuleEntry = strict ? 2 : 0
  return {
    name: 'strict',
    rules: [
      {
        'ts/no-explicit-any': value,
        'ts/no-non-null-assertion': value,
        'ts/no-unsafe-argument': value,
        'ts/no-unsafe-assignment': value,
        'ts/no-unsafe-call': value,
        'ts/no-unsafe-member-access': value,
        'ts/no-unsafe-return': value,
        'ts/no-unsafe-unary-minus': value,
        'ts/restrict-plus-operands': value,
        'ts/restrict-template-expressions': value
      }
    ]
  }
}
