import type { ESLint, Linter } from 'eslint'
import type { ClassicConfig, FlatConfig, SharedConfig } from '@typescript-eslint/utils/ts-eslint'

import type { Profile, ProfileRules, SourceType } from './types'

export interface ImportedProfile {
    config: PartialProfileConfig
    default?: PartialProfileConfig[]
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

export interface CacheOptions {
    /**
     *  Dictionary holding all aliases of plugins to hold in the cache for the plugins to import. They act as renames.
     *
     *  e.g.: `{ '@eslint-react/hooks-extra': 'eslint-plugin-react-hooks-extra' }`
     */
    mapper: Record<string, string>
}

export interface CacheData {
    files?: string[]
    ignores?: string[]
    languageOptions?: CacheLanguageOptions
    linterOptions?: LinterOptions
    plugins?: string[]
    processor?: string
    rules?: SharedConfig.RulesRecord
    settings?: Record<string, unknown>
}

export interface Cache {
    version: string
    data: CacheData[]
    config: CacheOptions
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
    reportUnusedDisableDirectives?: SharedConfig.Severity | SharedConfig.SeverityString | boolean
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
    ecmaVersion: SharedConfig.ParserOptions['ecmaVersion']

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
    parserOptions?: SharedConfig.ParserOptions

    /**
     * The type of JavaScript source code. Possible values are "script" for
     * traditional script files, "module" for ECMAScript modules (ESM), and
     * "commonjs" for CommonJS files. (default: "module" for .js and .mjs
     * files; "commonjs" for .cjs files)
     */
    sourceType: SourceType
}

/**
 *  Result of the parse profiles task, holding all the information to safely finish the config processing.
 */
export interface ParseProfilesResult {
    /**
     *  Final eslint config data to be returned.
     */
    configs: FlatConfig.Config[]
    /**
     *  Extra options for the extra caching process. The indices of this array are mapped with the final config data array.
     */
    cacheOpts: (CacheOptions | undefined)[]
}

// Strict version of Linter.FlatConfig
export interface ProfileConfig {
    [key: string]: any
    /**
     *  Plugins to apply. This is eslint-config-shiny only. Applying a plugin means to add it to the plugin list of the FlatConfig and automatically use
     *  the recommended config.
     */
    apply: Record<string, ESLint.Plugin>
    /**
     *  Extra options for caching.
     */
    cache: CacheOptions
    /**
     * Indicates that this config extends from another ProfileConfig or FlatConfig. This is eslint-config-shiny only.
     */
    extends: (FlatConfig.Config | ClassicConfig.Config | Profile)[]
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should apply to. If not specified, the configuration object applies
     * to all files
     */
    files: string[]
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should not apply to. If not specified, the configuration object
     * applies to all files matched by files
     */
    ignores: string[]
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
    rules: ProfileRules[]
    /**
     * An object containing name-value pairs of information that should be
     * available to all rules.
     */
    settings: Record<string, unknown>
}

export interface PartialProfileConfig {
    [key: string]: unknown
    /**
     *  Plugins to apply. This is eslint-config-shiny only. Applying a plugin means to add it to the plugin list of the FlatConfig and automatically use
     *  the recommended config.
     */
    apply?: Record<string, ESLint.Plugin>
    /**
     *  Extra options for caching.
     */
    cache?: CacheOptions
    /**
     * Indicates that this config extends from another ProfileConfig or FlatConfig. This is eslint-config-shiny only.
     */
    extends?: (FlatConfig.Config | ClassicConfig.Config | Profile)[]
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should apply to. If not specified, the configuration object applies
     * to all files
     */
    files?: string[]
    /**
     * An array of glob patterns indicating the files that the configuration
     * object should not apply to. If not specified, the configuration object
     * applies to all files matched by files
     */
    ignores?: string[]
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
    plugins?: FlatConfig.Plugins
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
    rules?: ProfileRules[]
    /**
     * An object containing name-value pairs of information that should be
     * available to all rules.
     */
    settings?: Record<string, unknown>
}

export interface ShinyConfig {
    /**
     *  Eslint plugins to apply to this config. This means, the plugin is added to the plugin array of the base config and all recommended rules are
     *  added to the base rules. This, of course, only works, if the config includes a config extending from base (vue, react, web, node).
     */
    apply?: Record<string, ESLint.Plugin>
    /**
     *  Enables the option to cache the entire converted config to a .temp folder
     *
     *  @defaultValue `true`
     */
    cache: boolean
    /**
     *  Name of the predefined flat configs to use
     *
     *  @defaultValue `['base']`
     */
    configs: Profile[]
    /**
     *  Additional configs to be parsed as well. Those will be treated as isolated config objects, but will be affected by caching and optimizing.
     */
    externalConfigs?: FlatConfig.Config[]
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
     *  @defaultValue: `{  '@typescript-eslint': 'ts', '@microsoft/sdl': 'sdl', '@stylistic/ts': 'styleTs', '@stylistic/js': 'styleJs', '@stylistic/Jsx': 'styleJsx' }`
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

export type PackageJsonDependencyTypes = 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies'

export interface PackageJsonAddress {
    email?: string
    url?: string
}

export interface PackageJsonPerson extends PackageJsonAddress {
    name: string
}

export interface PackageJson {
    name: string
    version: string
    description?: string
    keywords?: string
    homepage?: string
    bugs?: PackageJsonAddress
    license?: string
    author?: string | PackageJsonPerson
    contributors?: string[] | PackageJsonPerson[]
    files?: string[]
    main?: string
    browser?: string
    bin?: Record<string, string>
    man?: string
    types?: string
    type: 'module' | 'commonjs'
    exports: Record<string, string>
    directories?: {
        lib?: string
        bin?: string
        man?: string
        doc?: string
        example?: string
        test?: string
    }
    repository?: {
        type?: 'git'
        url?: string
        directory?: string
    }
    scripts?: Record<string, string>
    config?: Record<string, string>
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
    optionalDependencies?: Record<string, string>
    bundledDependencies?: string[]
    engines?: Record<string, string>
    os?: string[]
    cpu?: string[]
}
