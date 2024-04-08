import type { Profile, SourceType } from './types'
import type { ESLint, Linter } from 'eslint'

export interface ImportedProfile {
    config: PartialProfileConfig
    default?: PartialProfileConfig[]
}

/**
 * An object containing settings related to the linting process
 */
export interface LinterOptions {
    /**
     * A boolean value indicating if inline configuration is allowed.
     */
    noInlineConfig?: boolean

    /**
     * A severity value indicating if and how unused disable directives should be
     * tracked and reported.
     */
    reportUnusedDisableDirectives?: Linter.Severity | Linter.StringSeverity | boolean
}

/**
 * An object containing settings related to how JavaScript is configured for
 * linting.
 */
export interface LanguageOptions {
    /**
     * The version of ECMAScript to support. May be any year (i.e., 2022) or
     * version (i.e., 5). Set to "latest" for the most recent supported version.
     * @default "latest"
     */
    ecmaVersion: Linter.ParserOptions['ecmaVersion']

    /**
     * The type of JavaScript source code. Possible values are "script" for
     * traditional script files, "module" for ECMAScript modules (ESM), and
     * "commonjs" for CommonJS files. (default: "module" for .js and .mjs
     * files; "commonjs" for .cjs files)
     */
    sourceType: SourceType

    /**
     * An object specifying additional objects that should be added to the
     * global scope during linting.
     */
    globals: ESLint.Globals | ESLint.Globals[]

    /**
     * An object containing a parse() or parseForESLint() method.
     * If not configured, the default ESLint parser (Espree) will be used.
     */
    parser: Linter.FlatConfigParserModule

    /**
     * An object specifying additional options that are passed directly to the
     * parser() method on the parser. The available options are parser-dependent
     */
    parserOptions?: Linter.ParserOptions
}

// Strict version of Linter.FlatConfig
export interface ProfileConfig {
    [key: string]: any
    /**
     * Plugins to apply. This is eslint-config-shiny only.
     */
    apply: Record<string, unknown>
    /**
     * Indicates that this config extends from another ProfileConfig or FlatConfig. This is eslint-config-shiny only.
     */
    extends: (Profile | Linter.FlatConfig)[]
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should apply to. If not specified, the configuration object applies
     * to all files
     */
    files: Array<Linter.FlatConfigFileSpec | Linter.FlatConfigFileSpec[]>
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should not apply to. If not specified, the configuration object
     * applies to all files matched by files
     */
    ignores: Linter.FlatConfigFileSpec[]
    languageOptions: LanguageOptions
    linterOptions: LinterOptions
    /**
     * Either an object containing preprocess() and postprocess() methods or a
     * string indicating the name of a processor inside of a plugin
     * (i.e., "pluginName/processorName").
     */
    processor?: (string | Linter.Processor)[]
    /**
     * An object containing a name-value mapping of plugin names to plugin objects.
     * When files is specified, these plugins are only available to the matching files.
     */
    plugins: Record<string, ESLint.Plugin>

    /**
     * An object containing the configured rules. When files or ignores are specified,
     * these rule configurations are only available to the matching files.
     */
    rules: Linter.RulesRecord[]
    /**
     * An object containing name-value pairs of information that should be
     * available to all rules.
     */
    settings: Record<string, unknown>
}

export interface PartialProfileConfig {
    [key: string]: unknown
    /**
     * Plugins to apply. This is eslint-config-shiny only.
     */
    apply?: Record<string, unknown>
    /**
     * Indicates that this config extends from another ProfileConfig or FlatConfig. This is eslint-config-shiny only.
     */
    extends?: (Profile | Linter.FlatConfig)[]
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should apply to. If not specified, the configuration object applies
     * to all files
     */
    files?: Array<Linter.FlatConfigFileSpec | Linter.FlatConfigFileSpec[]>
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should not apply to. If not specified, the configuration object
     * applies to all files matched by files
     */
    ignores?: Linter.FlatConfigFileSpec[]
    languageOptions?: Partial<LanguageOptions>
    linterOptions?: Partial<LinterOptions>
    /**
     * Either an object containing preprocess() and postprocess() methods or a
     * string indicating the name of a processor inside of a plugin
     * (i.e., "pluginName/processorName").
     */
    processor?: (string | Linter.Processor)[]
    /**
     * An object containing a name-value mapping of plugin names to plugin objects.
     * When files is specified, these plugins are only available to the matching files.
     */
    plugins?: Record<string, ESLint.Plugin>

    /**
     * An object containing the configured rules. When files or ignores are specified,
     * these rule configurations are only available to the matching files.
     */
    rules?: Linter.RulesRecord[]
    /**
     * An object containing name-value pairs of information that should be
     * available to all rules.
     */
    settings?: Record<string, unknown>
}

export interface ShinyConfig {
    configs: Profile[]
    prettier: boolean
    gitignore: boolean
    eslintignore: boolean
}
