# eslint-config-shiny

Make your code so clean and polished that it shines! :sparkles:

## Installation

```powershell
pnpm i -D eslint-config-shiny
```

Create an empty `eslint.config.js`, if you have `"type": "module"` specified in your `package.json` or `eslint.config.mjs` if not.

```js
import shiny from 'eslint-config-shiny'

export shiny
```

In use with other frameworks:

```js
import react from 'eslint-config-shiny/profiles/react' // React already extends the base config
import vitest from 'eslint-config-shiny/profiles/vitest'

export [...vitest, ...react]
```

With own plugins (legacy):

```js
import unicorn from 'eslint-plugin-unicorn'

import react from 'eslint-config-shiny/profiles/react'

export [
    ...react,
    {
        rules: {
            ...unicorn.configs.recommended.rules
        }
    }
]
```

With own plugins (modern):

```js
import prettier from 'eslint-config-prettier'

import react from 'eslint-config-shiny/profiles/react'

export [
    prettier,
    ...react
]
```

## Important :warning:

-   It's forced to be ESM
-   It's designed to be used with TypeScript specifically
-   Configs are modular and can be combined in any way
-   It uses the modern flat config
-   It installs a lot of eslint plugins
-   It's still WIP and will change a lot to _my_ likings
-   It's written to output performant code
    -   A lot of [`eslint-plugin-unicorn`](https://www.npmjs.com/package/eslint-plugin-unicorn)'s rules destroy the performance of some algorithms or for clean code and are therefore deactivated

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

[x] TOML

[x] TypeScript

[x] YAML

## Configs :sparkles:

### Base

A simple config for all kinds of TypeScript ESNext applications without any framework or environment. It is the default export of `eslint-config-shiny` and is an array of configs.

```js
import shiny from 'eslint-config-shiny'

export default shiny
```

### Browser

A simple browser configuration designed for browser applications. It is a single eslint config and extends the base config.

```js
import browser from 'eslint-config-shiny/profiles/browser.js'

export default browser
```
