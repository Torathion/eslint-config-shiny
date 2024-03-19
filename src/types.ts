export type RuleLevel = number | 'error' | 'warn' | 'off'
export type OptionsObject = Record<string, unknown>
export type ArrayOption = [RuleLevel, OptionsObject]
export type ArrayTypeOption = [RuleLevel, string]
export type ArrayTypeObjectOption = [RuleLevel, string, OptionsObject]
export type RuleValue = RuleLevel | ArrayOption | ArrayTypeOption | ArrayTypeObjectOption
export type Rules = Record<string, RuleValue>

export interface Config {
    rules: Rules
    plugins: Record<string, unknown>
}

export interface Plugin {
    configs: Record<string, Config>
}
