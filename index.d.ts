import { ESLint } from 'eslint'
import { FlatConfig } from '@typescript-eslint/utils/ts-eslint'

export type Profile =
    | 'base'
    | 'format'
    | 'jest'
    | 'node'
    | 'react'
    | 'test-base'
    | 'test-react'
    | 'test-vue'
    | 'test-web'
    | 'tsdoc'
    | 'vitest'
    | 'vue'
    | 'web'

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
     *  @defaultValue: `{ '@typescript-eslint': 'ts', '@microsoft/sdl': 'sdl', '@stylistic/ts': 'styleTs', '@stylistic/js': 'styleJs', '@stylistic/Jsx': 'styleJsx' }`
     */
    rename: Record<string, string>
    /**
     *  Specifies the folder all the configuration files should be parsed from.
     *
     *  @defaultValue `process.cwd()`
     */
    root: string
    /**
     *  Extra list of renames that instead strip the entire value instead of replacing it. This list will always be merged with the defaults to
     *  handle the `base` profile.
     *
     *  @defaultValue `[@eslint-community]`
     */
    trim: string[]
    /**
     *  The manual way to specify the tsconfig to use, if the tool can't determine it.
     */
    tsconfigPath?: string
    /**
     *  Updates the browserslist used for plugins
     *
     *  @defaultValue `true`
     */
    updateBrowsersList: boolean
}

/**
 *  Main part of `eslint-config-shiny` to merge and handle configurations options.
 *
 * @param options - options for this tool
 * @returns a fully configured Flatconfig array.
 */
export default function shiny(options: Partial<ShinyConfig>): Promise<FlatConfig.Config>
