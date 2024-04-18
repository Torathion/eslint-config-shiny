import { Linter } from 'eslint'

export interface ShinyConfig {
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
}

/**
 *  Main part of `eslint-config-shiny` to merge and handle configurations options.
 *
 * @param options - options for this tool
 * @returns a fully configured Flatconfig array.
 */
export default async function shiny(options: Partial<ShinyConfig>): Promise<Linter.FlatConfig[]>
