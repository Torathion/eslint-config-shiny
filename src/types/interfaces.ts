import type { ESLint, Linter } from 'eslint'

import type { MaybeArray, Profile, SourceType } from './types'

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

    /**
     * The type of JavaScript source code. Possible values are "script" for
     * traditional script files, "module" for ECMAScript modules (ESM), and
     * "commonjs" for CommonJS files. (default: "module" for .js and .mjs
     * files; "commonjs" for .cjs files)
     */
    sourceType: SourceType
}

// Strict version of Linter.FlatConfig
export interface ProfileConfig {
    [key: string]: any
    /**
     * Plugins to apply. This is eslint-config-shiny only.
     */
    apply: Record<string, ESLint.Plugin>
    /**
     * Indicates that this config extends from another ProfileConfig or FlatConfig. This is eslint-config-shiny only.
     */
    extends: (Linter.FlatConfig | Profile)[]
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should apply to. If not specified, the configuration object applies
     * to all files
     */
    files: MaybeArray<Linter.FlatConfigFileSpec>[]
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should not apply to. If not specified, the configuration object
     * applies to all files matched by files
     */
    ignores: Linter.FlatConfigFileSpec[]
    languageOptions: LanguageOptions
    linterOptions: LinterOptions
    /**
     * The internal name of the profile
     */
    name: string
    /**
     * An object containing a name-value mapping of plugin names to plugin objects.
     * When files is specified, these plugins are only available to the matching files.
     */
    plugins: Record<string, ESLint.Plugin>
    /**
     * Either an object containing preprocess() and postprocess() methods or a
     * string indicating the name of a processor inside of a plugin
     * (i.e., "pluginName/processorName").
     */
    processor?: Linter.Processor[]

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
    apply?: Record<string, ESLint.Plugin>
    /**
     * Indicates that this config extends from another ProfileConfig or FlatConfig. This is eslint-config-shiny only.
     */
    extends?: (Linter.FlatConfig | Profile)[]
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should apply to. If not specified, the configuration object applies
     * to all files
     */
    files?: MaybeArray<Linter.FlatConfigFileSpec>[]
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should not apply to. If not specified, the configuration object
     * applies to all files matched by files
     */
    ignores?: Linter.FlatConfigFileSpec[]
    languageOptions?: Partial<LanguageOptions>
    linterOptions?: Partial<LinterOptions>
    /**
     * The internal name of the profile
     */
    name: string
    /**
     * An object containing a name-value mapping of plugin names to plugin objects.
     * When files is specified, these plugins are only available to the matching files.
     */
    plugins?: Record<string, ESLint.Plugin>
    /**
     * Either an object containing preprocess() and postprocess() methods or a
     * string indicating the name of a processor inside of a plugin
     * (i.e., "pluginName/processorName").
     */
    processor?: Linter.Processor[]

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
    /**
     *  Enables the option to cache the entire converted config to a .temp folder
     *
     *  @defaultValue `true`
     */
    cache: boolean
    /**
     *  Name of the predefined flatconfigs to use
     *
     *  @defaultValue `['base']`
     */
    configs: Profile[]
    /**
     * Names of the .ignore files to use.
     *
     *  @defaultValue `['.eslintignore', '.gitignore']`
     */
    ignoreFiles: string[]
    /**
     *  Adds indentation rules to the configs. Since those are considered [major linting performance issues](https://github.com/typescript-eslint/typescript-eslint/issues/1824),
     *  they are disabled by default.
     *
     *  Requires the prettier option to be true and `tabWidth` or `useTabs` to be defined.
     *
     *  @defaultValue `false`
     */
    indent: boolean
    /**
     * Flag indicating whether the VSCode IDE should be patched for native eslint linting or not.
     *
     *  @defaultValue `true`
     */
    patchVSCode: boolean
    /**
     * Flag indicating whether the tool should look into the prettier file.
     *
     *  @defaultValue `true`
     */
    prettier: boolean
    /**
     *  Rename plugins used in the configs in a map object in the sense of "from - to".
     *
     *  @example
     *  ```
     *  // Renames all rules of "typescript-eslint" to "ts"
     *  export default await shiny({ configs: ['base'], rename: { '@typescript-eslint': 'ts' }})
     *  ```
     *  @defaultValue: `{ '@arthurgeron/react-usememo': 'use-memo', '@typescript-eslint': 'ts', '@microsoft/sdl': 'sdl' }`
     */
    rename: Record<string, string>
    /**
     *  Specifies the folder all the configuration files should be parsed from.
     *
     *  @defaultValue `process.cwd()`
     */
    root: string
    /**
     *  Updates the browserslist used for plugins
     *
     *  @defaultValue `true`
     */
    updateBrowsersList: boolean
}

export interface CacheParserOptions {
    ecmaFeatures: Record<string, boolean>
    ecmaVersion: number | string
    extraFileExtensions: string[]
    parser?: string
    project: string[]
    sourceType: string
    tsconfigRootDir: string
    vueFeatures?: Record<string, boolean>
}

export interface CacheLanguageOptions {
    ecmaVersion: Linter.ParserOptions['ecmaVersion']
    globals: ESLint.Globals
    parser: string
    parserOptions?: CacheParserOptions
    sourceType: string
}

export interface CacheData {
    files?: string[]
    ignores?: string[]
    languageOptions?: CacheLanguageOptions
    linterOptions?: LinterOptions
    plugins?: string[]
    processor?: string
    rules?: Linter.RulesRecord
    settings?: Record<string, unknown>
}
