export interface Config {
    rules: Record<string, number>
    plugins: Record<string, unknown>
}

export interface Plugin {
    configs: Record<string, Config>
}
