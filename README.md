# eslint-config-shiny

<p align="center">
<h1 align="center">Quick and versatile config for optimized eslint configurations</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/eslint-config-shiny"><img src="https://img.shields.io/npm/v/eslint-config-shiny?style=for-the-badge&logo=npm"/></a>
  <a href="https://npmtrends.com/eslint-config-shiny"><img src="https://img.shields.io/npm/dm/eslint-config-shiny?style=for-the-badge"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/Torathion/eslint-config-shiny?style=for-the-badge"/></a>
  <a href="https://codecov.io/gh/torathion/eslint-config-shiny"><img src="https://codecov.io/gh/torathion/eslint-config-shiny/branch/main/graph/badge.svg?style=for-the-badge" /></a>
  <a href="https://github.com/torathion/eslint-config-shiny/actions"><img src="https://img.shields.io/github/actions/workflow/status/torathion/eslint-config-shiny/build.yml?style=for-the-badge&logo=esbuild"/></a>
  <a href="https://github.com/prettier/prettier#readme"><img alt="code style" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=prettier"></a>
</p>
</p>

Make your code so clean and polished that it shines! :sparkles:

`eslint-config-shiny` is a sophisticated configuration tool to create the most optimal eslint experience by doing all the heavy work for you! Just say what framework and for what purpose you want to use it and `eslint-config-shiny` will do the rest for you.

## Installation

```powershell
pnpm i -D eslint-config-shiny
```

Create an empty `eslint.config.js`, if you have `"type": "module"` specified in your `package.json` or `eslint.config.mjs` if not.

```js
import shiny from 'eslint-config-shiny'

export default await shiny()
```

In use with other frameworks:

```js
import shiny from 'eslint-config-shiny'

export default await shiny({ configs: ['react', 'vitest'] })
```

With own rules:

```js
import shiny from 'eslint-config-shiny'
import unicorn from 'eslint-plugin-unicorn'


export [
    ...await shiny({ configs: ['react'] }),
    {
        rules: {
            ...unicorn.configs.recommended.rules,
            'ts/no-unsafe-argument': 0
        }
    }
]
```

:warning: Renamed plugins need to be addressed as such. Check the default renames below to see what plugins are renamed.

Applying recommended rules from other plugins:

```js
import fp from 'eslint-plugin-functional'
import shiny from 'eslint-config-shiny'

export await shiny({ configs: ['react'], apply: {fp} })
```

Adding external configs:

```js

import packageJson from 'eslint-plugin-package-json/configs/recommended'
import json from 'eslint-plugin-package-json'
import shiny from 'eslint-config-shiny'

export await shiny({ configs: ['react'], externalConfigs: [packageJson, json.configs.recommended] })
```

## Important :warning:

-   It's forced to be ESM
-   It's designed to be used with TypeScript specifically, but can still handle plain JavaScript
-   It uses the modern flat config
-   It installs a lot of eslint plugins
-   It's very opinionated with a lot of formatting rules
-   It's written to output performant code. Any plugins that increase readability, but can decrease the performance in any away, will be deactivated.

## Supports

-   TypeScript
-   React
-   Vue
-   Vitest
-   Node.js
-   Jest
-   TestingLibrary

## Configuration :wrench:

The `ShinyConfig` is a big and flexible object that holds all the options of the project and is used to further to optimize the experience of using ESLint.

### apply

-   Adds the recommended rules and the plugin to the base config.
-   Only works if you have a base profile selected (so, not test or format)

### cache

-   Caches the fully converted config array under `cwd/.temp/shiny-config.json`
-   If enabled, it will always prioritize the cached config and won't patch or transform anything, except from previously used renames.
-   All plugins, parsers and processors need to be imported, so it only skips the converting importing time.
-   **Default**: `true`

### configs

-   Specify which configuration preset you want to use
-   The preset names are mapped to the profile file names.
-   Possible profiles:
    -   `base`
    -   `format`
    -   `jest`
    -   `json`
    -   `node`
    -   `react`
    -   `test-base`
    -   `test-react`
    -   `test-vue`
    -   `test-web`
    -   `tsdoc`
    -   `vitest`
    -   `vue`
    -   `web`
    -   `empty` (For debugging purposes only)
-   **Default**: `['base']`
-   Profiles extend from each other in a tree structure way. You are still allowed to use as many profiles as you want.

### externalConfigs

-   Additional configs to add to the final output config array
-   Those configs will also be cached and optimized

### ignoreFiles

-   Specifies the ignore files you want to use
-   **Default**: `['.gitignore']`

### indent

-   Enables all indentation rules, i.e. : `@stylistic/ts/indent`, `vue/html-indent` and `@stylistic/jsx/jsx-indent`
-   It requires a valid `.prettierrc` file to work
-   **Default**: `false`

### patchVSCode

-   Specifies if you want to patch VSCode to optimize the native linting experience
-   Will only patch it, if there is no cache
-   **Default**: `true`

### prettier

-   Specifies if `eslint-config-shiny` should look into your prettier config to add stylistic rules
-   **Default**: `true`

### rename

-   renames used plugins.
-   Default values will always be renamed.
-   **Default**:

```ts
{
    '@eslint-react': 'react',
    '@microsoft/sdl': 'sdl',
    '@stylistic/js': 'styleJs,'
    '@stylistic/jsx': 'styleJsx',
    '@stylistic/ts': 'styleTs',
    '@typescript-eslint': 'ts'
}
```

### root

-   Specifies the root directory
-   All plugins fetch the corresponding files from the given root directory and will ignore sub directory files
-   **Default**: `process.cwd()`

### strict

-   Enables strict rules for typechecking
-   **Default**: `false`

### trim

-   Brother of `rename` that instead removes parts of the plugin name permanently.
-   **Default**: `['@eslint-community']`

### tsconfigPath

-   A manual way to define the path of the `tsconfig.json` to use, if the automatic search fails

### updateBrowsersList

-   Updates the browsers list for `eslint-plugin-compat`
-   Will only update it, if there is no cache
-   It's a long task
-   **Default**: `false`

## Optimizations

`eslint-config-shiny` optimizes eslint configs by deduplicating rules and reducing rule names to make eslint output more readable. You can deactivate most optimizations, if they clash with other tools when used in tandem:

### renames

-   Default: `true`
-   Enables renames to shorten plugin names.

### trims

-   Default: `true`
-   Enables name trims to shorten plugin names.

### numericValues

-   Default: `true`
-   Changes eslint rule values from `"off"`, `"warn"`, `"error"` to numeric equivalent values to reduce cache file.

---

© Torathion 2024
