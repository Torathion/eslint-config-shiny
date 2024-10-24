# eslint-config-shiny

[![NPM license](https://img.shields.io/npm/l/eslint-config-shiny.svg)](https://www.npmjs.com/package/eslint-config-shiny)
[![NPM version](https://img.shields.io/npm/v/eslint-config-shiny.svg)](https://www.npmjs.com/package/eslint-config-shiny)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-config-shiny.svg)](http://www.npmtrends.com/eslint-config-shiny)

Make your code so clean and polished that it shines! :sparkles:

`eslint-config-shiny` is a sophisticated configuration tool to create the most optimal eslint experience by doing all the heavy work for you! Just say what framework and for what purpose you want to use it and `eslint-config-shiny` will do the rest for you.

## As of now, it does not work with eslint 9 as most plugins haven't updated yet. Please stay with eslint 8.57.0!

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

With own plugins (legacy):

```js
import shiny from 'eslint-config-shiny'
import unicorn from 'eslint-plugin-unicorn'


export [
    ...await shiny({ configs: ['react'] }),
    {
        rules: {
            ...unicorn.configs.recommended.rules
        }
    }
]
```

With own plugins (modern):

```js
import shiny from 'eslint-config-shiny'
import prettier from 'eslint-config-prettier'

export [
    ...await shiny({ configs: ['react'] }),
    ...prettier
]
```

## Important :warning:

-   It's forced to be ESM
-   It's designed to be used with TypeScript specifically, but can still handle plain JavaScript
-   It uses the modern flat config
-   It installs a lot of eslint plugins
-   It's very opinionated with a lot of formatting rules
-   It's written to output performant code. Any plugins that increase readability, but can decrease the performance in any away, will be deactivated.

## Supported frameworks

[x] Jest

[x] Node.js

[x] React

[x] Storybook

[x] TestingLibrary

[x] Vitest

[x] Vue

## Supported File Formats

[x] JSON

[x] TypeScript

## Options :sparkles:

### Configuration

If you have further questions with the config object, you can use the type `ShinyConfig`

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
    -   `fp`
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
-   **Default**: `['base']`
-   Profiles extend from each other in a tree structure way. You are still allowed to use as many profiles as you want.

### ignoreFiles

-   Specifies the ignore files you want to use
-   **Default**: `['.gitignore', '.eslintignore']`

### indent

-   Enables all indentation rules, i.e. : `@stylistic/ts/indent`, `vue/html-indent` and `@stylistic/jsx/jsx-indent`
-   It requires a valid `.prettierc` file to work
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
-   Default values will always be renamed
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

### updateBrowsersList

-   Updates the browsers list for `eslint-plugin-compat`
-   Will only update it, if there is no cache
-   It's a long task
-   **Default**: `false`

---

© Torathion 2024
