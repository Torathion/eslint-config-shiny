export type RuleLevel = number | 'error' | 'off' | 'warn'
export type OptionsObject = Record<string, unknown>
export type ArrayOption = [RuleLevel, OptionsObject]
export type ArrayTypeOption = [RuleLevel, string]
export type ArrayTypeObjectOption = [RuleLevel, string, OptionsObject]
export type RuleValue = ArrayOption | ArrayTypeObjectOption | ArrayTypeOption | RuleLevel
export type Rules = Record<string, RuleValue>

export interface Config {
    plugins: Record<string, unknown>
    rules: Rules
}

export interface Plugin {
    configs: Record<string, Config>
}
