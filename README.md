# eslint-config-shiny

[![NPM license](https://img.shields.io/npm/l/eslint-config-shiny.svg)](https://www.npmjs.com/package/eslint-config-shiny)
[![NPM version](https://img.shields.io/npm/v/eslint-config-shiny.svg)](https://www.npmjs.com/package/eslint-config-shiny)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-config-shiny.svg)](http://www.npmtrends.com/eslint-config-shiny)

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
    ...react
]
```

## Important :warning:

-   It's forced to be ESM
-   It's designed to be used with TypeScript specifically
-   It uses the modern flat config
-   It installs a lot of eslint plugins
-   It's written to output performant code. Any plugins that increase readability, but can decrease the performance in any away, will be deactivated.

## Supported frameworks

[x] Angular

[x] Cypress

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

### configs

-   Specify which configuration preset you want to use
-   The preset names are mapped to the profile file names.
-   Possible profiles:
    -   `angular`
    -   `base`
    -   `cypress`
    -   `format`
    -   `fp`
    -   `jest`
    -   `json`
    -   `node`
    -   `react`
    -   `test-angular`
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

### patchVSCode

-   Specifies if you want to patch VSCode to optimize the native linting experience
-   **Default**: `true`

### prettier

-   Specifies if `eslint-config-shiny` should look into your prettier config to add stylistic rules
-   **Default**: `true`

---

© Torathion 2024
