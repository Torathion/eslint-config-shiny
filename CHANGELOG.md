# Changelog

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
