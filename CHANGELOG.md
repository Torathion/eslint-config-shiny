# Changelog

### [4.3.0] 06-15-2025

### Changed

- Migrated to `@stylistic/eslint-plugin` with a rename of `style`

### Fixed

- `unicorn-x` migration

## [4.2.2] 06-15-2025

### Changed

- Migrated from `unicorn` to `unicorn-x` for better linting performance
- Use recommended default in `styleJs/yield-star-spacing`

### Updated

- to new `typescript-eslint` recommended config
- to new `vue` recommended config
- to new `testing-library` configs

### Removed

- `@eslint/eslintrc` package as `globals` updated to newest ECMAScript version

## [4.2.1] 05-13-2025

### Fixed

-   Crash on `reading properties of undefined (reading length)`
-   Crash on wrong input patterns of `ignores`
-   Crash on unbuildable package on certain machines.

## [4.2.0] 05-13-2025

### Added

-   `silent` option to remove logging
-   `optimizations` option to be able to disable each optimization

### Fixed

-   return type misalignment
-   crash on test only profile.
-   moved `@typescript-eslint/utils` to `dependencies` to fix type resolution
-   Slightly better visualization in logging between profile parsing and plugin runs
-   Crash on too many config instances opened.

### Removed

-   `updateBrowsersList` option. (Did anyone ever use it?)
-   `no-underscore-dangle` as it interfered with ignoring `ts/no-unused-vars`
-   `promise/prefer-await-to-then` as it's hindering in promise extension classes.
-   `promise/avoid-new` as it was activated, even though the documentation denied it (?).
-   `unicorn/no-thenable` as it's hindering in promise extension classes.
-   `unicorn/prefer-at` as it's slower than `arr[arr.length - 1]`.

### Misc

-   Updated Deps
-   Added basic tests
-   Added CI stuff

### Changed

-   Lowered severity level on several base rules

## [4.1.0] 01-12-2025

### Added

-   Easier process interrupt
-   `strict` option to increase the the strictness of typechecking rules. This means, all strict rules have been finally and properly removed from the base config.
-   `empty` profile to fallback to, when issues arise.
-   Message to inform when no rules has been found to lint with. This falls back to the `empty` profile.

### Fixed

-   Properly overwrite renamed rules.
-   Removed `knip` from devDependencies as this rarely caused package manager resolution errors.
-   Indentation rules that were supposed to only half indent actually half indent now.
-   Properly separated config fetching and plugin steps visually
-   Rare crash on empty plugin array

### Changed

-   Updated perfectionist import sorting.
-   Does not process the prettier file, if no `format` profile has been specified
-   Moved stylistic rules from `base` to `format`

### Removed

-   `eslint-plugin-sonarjs` as this was most redundant and bloated the eslint config.
-   `eslint-plugin-security` completely as it's very situational and can be easily applied outside.
-   `no-constant-condition` in favor of `ts/no-unnecessary-condition`
-   `promise/prefer-await-to-callbacks` as this rule saw `callback` as a reserved keyword to ALWAYS flag it as an issue.
-   `styleTs/no-extra-parens` to prefer the way prettier applies parens
-   `unicorn/prefer-math-min-max` as ternaries are faster. (`Math.min` and `Math.max` are designed to work with arrays = extra overhead)
-   Properly remove `unicorn/prefer-math-apis` instead of the type version introduced in the last version

### Misc

-   Updated dependencies
-   Cleaned up project by removing unused stuff
-   Reworked display output
-   Migrated to [typestar](https://www.npmjs.com/package/typestar)

## [4.0.0] 11-10-2024

### BREAKING

-   Removed `angular` profile as I'm not using this framework anymore
-   Removed `cypress` profile for the same reason
-   Removed `fp` profile in favor of introducing the `apply` option
-   Remove `json` profile in favor of introducing the `externalConfigs` option
-   Removed `storybook` support as I'm not using it and can be easily added externally, because of it's minimal configuration

### Added

-   more rules and changed deprecated rules in VSCode file patching.
-   `no-loss-of-precision` as the JS interpreter can only read a specific precision of numbers
-   `ts/no-unnecessary-parameter-property-assignment` to shorten class constructor code
-   `guard-for-in` to not accidentally iterate through object prototype values
-   `logical-assignment-operators` to shorten code
-   `no-constructor-return` to prevent useless code
-   `no-eq-null` to enforce `===` and `!==` in `null` comparisons
-   `no-eval` to prevent xss
-   `no-extend-native` as it's a memory and performance consuming anti-pattern
-   Way more promise rules for safer `Promise` development
-   Emit error if an unknown profile has been given
-   Enabled `eslint-plugin-jsx-a11y` back again
-   Using the new `projectService` property of TypeScript-Eslint 8
-   Manual `tsconfigPath` option for tsconfig project resolving
-   `trim` option as a partner of `rename` to permanently remove a part of a plugin name
-   More errors for clearer troubleshooting

### Fixed

-   Properly finish tool if an error has been encountered
-   Crash upon not giving an option object
-   Adjusted profile merging to not overwrite settings

### Changed

-   Overhauled plugin re-importing from cache to both consider the current project and `eslint-config-shiny`'s dependencies
-   Overhauled project structure to support the caching of plugins importing sub plugins. Internally for now.
-   Overhauled `parseIgnoreFiles` to go up the file tree to find ignore files
-   Overhauled `DisplayTaskHandler` to support the branching routes of the tool
-   increase tolerance in `no-secrets/no-secrets`
-   Disabled void return checks in `ts/no-misused-promises` for async html event handlers
-   Updated `perfectionist` rules
-   Updated `stylistic` rules
-   Optimized the size of cache files
-   Further optimization in renaming and parsing rules
-   Migrated back to `eslint-plugin-import`
-   Reduced the number of resolved extensions in the base config and distributed the rest to the corresponding profiles
-   Migrated from `eslint-plugin-vitest` to `@vitest/eslint-plugin`
-   `test` profile does not extend from `base` anymore to reduce cache file size
-   Use `perfectionist` import sorting instead of `import`'s

### Removed

-   `unicorn/prefer-modern-maths-apis` as some functions kill the performance
-   `styleJsx/jsx-max-props-per-line` in favor of prettier line length
-   `unicorn/no-array-callback-reference` as it disallowed the reuse of mapper functions
-   deprecated `.eslintignore` from file `ignoreFiles` default
-   abandoned plugin `eslint-plugin-deprecation` for the corresponding ts rule
-   `eslint-plugin-xss` for being abandoned
-   `eslint-plugin-ssr-friendly` for being abandoned
-   `@arthurgeron/eslint-plugin-react-usememo` for not supporting Eslint 9
-   `eslint-plugin-redundant-undefined` for `ts/no-duplicate-type-constituents`
-   `eslint-plugin-node-security` for being abandoned
-   the parsing of duplicate `eslint-plugin-sdl` rules
-   Migrated `eslint-plugin-eslint-comments` to the `@eslint-community` one

### Misc

-   Updated dependencies
-   Updated types
-   the rule replacement concept as this only bloated the cache file and most of those replaced rules are already deprecated
-   Added resolutions to the package.json
-   Updated package manager
-   Cleanup

## [3.2.1] 05-21-2024

### Changed

-   Properly added `eslint-plugin-security-node` again

## [3.2.0] 05-21-2024

### Added

-   `eslint-plugin-react-refresh` for faster development
-   `eslint-plugin-no-secrets` for saver development
-   `eslint-plugin-no-unsanitized` to reduce security vulnerabilities
-   `eslint-plugin-xss` to reduce security vulnerabilities
-   `eslint-plugin-autofix` to automatically fix some rules eslint doesn't fix
-   Option to automatically update the browserslist for `eslint-plugin-compat`

### Changed

-   updated Dependencies
-   Migrated from `eslint-plugin-react` to `@eslint-react`
-   Made VSCode patching more robust
-   Made renaming more robust
-   Made caching more robust
-   Overhauled react styling rules
-   Fixed task display bugs
-   Tweaked some styling rules
-   Fixed the edge case of handling array profiles

### Removed

-   Disabled `@typescript/no-unsafe-return` for real this time

## [3.1.0] 05-01-2024

### Added

-   New rules for node config
-   New option to rename plugins
-   New option to specify project root
-   New option to cache the fully parsed config array
-   New option to enable indentation rules
-   Globals for vue config
-   Globals for window api
-   Use vue-accessibility rules
-   Enabled `@stylistic/jsx/jsx-curly-brace-presence`
-   Enabled `@typescript-eslint/no-unnecessary-qualifier` to reduce ts code
-   Enabled `@athurgeron/eslint-plugin-react-usememo`

### Changed

-   Fixed eslint errors when using the node config
-   Update Dependencies
-   Modified `@typescript-eslint/no-unused-vars` to allow unused parameters
-   Fixed problems when applying plugins. The prettier and ignore plugins work properly now
-   Fixed VSCode patch to correctly merge with pre-existing `setting.json` file
-   Renamed `@typescript-eslint` rules to `ts` rules
-   Renamed `@microsoft/sdl` rules to `sdl` rules
-   Moved SDL rules from `base` to `web`

### Removed

-   `eslint-plugin-styled-components-a11y` from dependency list
-   Disabled `@typescript-eslint/no-use-before-define` as bundlers will manage this
-   Disabled `unicorn/import-style` as it wants the default imports of node packages
-   Disabled `@typescript/no-unsafe-return`

## [3.0.0] 04-19-2024

### Added

-   Exposed Types
-   Add progress to see the tool working
-   Option to patch VSCode native linting to fit the tool
-   Arbitrary ignore file support

### Changed

-   Converted profiles to TypeScript
-   Overhauled and reformated every profile and fixed a lot of config bugs
-   Complete Rewrite of config merging and fetching
-   Updated Vue rules
-   Added more autofixable base ESLint rules
-   Manually activated eslint-plugin-sdl rules as the configs are still legacy
-   Migrated from `eslint-plugin-i` to `esling-plugin-x`
-   Reduced duplicate eslint-rules that were already included from extended configs
-   Enabled `@eslint-react` rules, but not fully as it sill depends on legacy features
-   Reenabled some old disabled `eslint-plugin-unicorn` rules
-   Overhauled README.md

### Removed

-   `eslint-plugin-toml` as it already features a flat config
-   `eslint-plugin-yml` as it already features a flat config
-   `@shopify/eslint-plugin` as it's unmaintained and mostly useless

## [2.4.0] 03-25-2024

### Added

-   Dynamic tsconfig file parsing. It only reads the file names of the files in the root directory. Further support with extending configs will be added later.

### Changed

-   Updated dependencies
-   Sped up prettier file parsing
-   Sped up config merging
-   Replaced `eslint-merge-processors` with own faster implementation
-   Replaced `eslint-config-flat-gitignore` with own faster implementation

## [2.3.0] 03-19-2024

### Added

-   This config now parses your prettier config file if one is found. It has to be in the format `.prettierrc`
-   Enabled `unicorn/no-null` as the deactivation reason was too specific
-   Enabled `unicorn/prefer-module` as the deactivation reason is no longer valid (electron 29 finally supports es6 syntax)

### Changed

-   Update dependencies
-   Speedup rule and globals merging and file gathering
-   The engine is now strict and mirrors the engine needed for the newest eslint version
-   Improve globs

### Removed

-   Disabled `import/no-cycle` as it complicated dynamic imports too much
-   Disabled `import/no-named-as-default` as it does not understand subpackages
-   Disabled `testing-library/no-await-sync-events` in `browser-testing-vue` profile as its a false positive.

## [2.2.0] 03-14-2024

### Changed

-   Speedup config merging
-   Remove unnecessary configuration from the test profiles
-   replace `perfectionist/sort-imports` with `import/order`

### Removed

-   remove `@babel/eslint-plugin` as it's no longer maintained
-   remove `@stylistic/js/dot-location` as I realized the preferred style is ugly

## [2.1.0] 03-11-2024

### Fixed

-   block `no-extra-parens` completely now

### Removed

-   `eslint-plugin-prettier` as it took 40 - 60 % of the linting time on average
-   `eslint-config-prettier` as it blocked too many style rules that prettier does not format
-   `@typescript-eslint/max-params` as it's too restrictive

## [2.0.0] 03-08-2024

### Added

-   own internal API for more controlled profile managing
-   added `brower-testing-vue` profile
-   added `test-base` profile for the use of library independent testing
-   added vue processors
-   added `.gitignore` support

### Changed

-   overhauled browser config
-   move [eslint-plugin-tsdoc](https://www.npmjs.com/package/eslint-plugin-tsdoc) to its own profile
-   better rule replacement handling between `eslint`, `@typescript-eslint`, `@babel` and `@stylistic/ts`
-   better file globbing for testing libraries
-   reduced the file size due to duplicate rules
-   deactivated `security/detect-non-literal-fs-filename` because of too many false positives
-   deactivated `@typescript-eslint/unbound-method` as it goes against functional programming
-   deactivated `regexp/strict` as it interferes with `unicorn/better-regex`

### Removed

-   removed [eslint-plugin-markdown](https://www.npmjs.com/package/eslint-plugin-markdown) as it now has its own flat config
-   removed [eslint-plugin-playwright](https://www.npmjs.com/package/eslint-plugin-playwright) as it threw errors in conjunction with cypress or other e2e frameworks.
-   removed `noInlineConfig` setting

## [1.1.3] 03-05-2024

-   Make every config finally work. I realized that popping and pushing the imported final config array didn't work.

## [1.1.2] 03-04-2024

-   Github and NPM are acting up in ways I've never seen before. Should be fixed? Please?

## [1.1.1] 03-04-2024

-   Remove espree again, as it seems it's not a flatconfig parser

## [1.1.0] 03-04-2024

### Changed

-   Update vue config to closer resemble [@vue/eslint-config-typescript](https://github.com/vuejs/eslint-config-typescript)

## [1.0.2] 03-04-2024

### Changed

-   Cleanup project publishing and releasing
