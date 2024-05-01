# Changelog

## [3.1.0] 2024-05-01

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

## [3.0.0] 2024-04-19

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

## [2.4.0] 2024-03-25

### Added

-   Dynamic tsconfig file parsing. It only reads the file names of the files in the root directory. Further support with extending configs will be added later.

### Changed

-   Updated dependencies
-   Sped up prettier file parsing
-   Sped up config merging
-   Replaced `eslint-merge-processors` with own faster implementation
-   Replaced `eslint-config-flat-gitignore` with own faster implementation

## [2.3.0] 2024-03-19

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

## [2.2.0] 2024-03-14

### Changed

-   Speedup config merging
-   Remove unnecessary configuration from the test profiles
-   replace `perfectionist/sort-imports` with `import/order`

### Removed

-   remove `@babel/eslint-plugin` as it's no longer maintained
-   remove `@stylistic/js/dot-location` as I realized the preferred style is ugly

## [2.1.0] 2024-03-11

### Fixed

-   block `no-extra-parens` completely now

### Removed

-   `eslint-plugin-prettier` as it took 40 - 60 % of the linting time on average
-   `eslint-config-prettier` as it blocked too many style rules that prettier does not format
-   `@typescript-eslint/max-params` as it's too restrictive

## [2.0.0] 2024-03-08

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

## [1.1.3] 2024-03-05

-   Make every config finally work. I realized that popping and pushing the imported final config array didn't work.

## [1.1.2] 2024-03-04

-   Github and NPM are acting up in ways I've never seen before. Should be fixed? Please?

## [1.1.1] 2024-03-04

-   Remove espree again, as it seems it's not a flatconfig parser

## [1.1.0] 2024-03-04

### Changed

-   Update vue config to closer resemble [@vue/eslint-config-typescript](https://github.com/vuejs/eslint-config-typescript)

## [1.0.2] 2024-03-04

### Changed

-   Cleanup project publishing and releasing
