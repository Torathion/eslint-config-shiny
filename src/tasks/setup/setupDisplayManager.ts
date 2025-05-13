import { join } from 'node:path'
import type { DisplayConfig, ShinyConfig } from 'src/types'
import { DisplayManager } from 'src/handler'

const displayOptions: DisplayConfig = {
    branches: {
        cached: [
            { color: 'yellow', text: 'Validating cache file' },
            { color: 'cyan', text: 'Applying cache' }
        ],
        generic: { color: 'magenta', text: 'Optimizing configs' },
        uncached: [
            { color: 'yellow', text: 'Fetching configs' },
            { color: 'cyan', fallback: 'No extra plugins needed to be applied!', text: 'Applying plugins' },
            { color: 'blue', text: 'Parsing profiles' }
        ]
    },
    messages: {
        complete: 'Ready to lint after %time%!',
        noRules: 'No rules to lint with. Finished after %time%!'
    },
    optional: {
        caching: {
            color: 'magenta',
            text: `Caching final config under "${join('%root%', '.temp', 'shiny-config.json')}"`
        },
        patchVSCode: {
            color: 'cyan',
            text: 'Patching VSCode'
        },
        updateBrowserList: {
            color: 'cyan',
            text: 'Updating browser list'
        }
    },
    options: {
        dots: true
    },
    warnings: {
        eslintFound: 'eslint.options were found in your vscode settings.json. Please merge this config into your eslint.config.js!',
        malformedCache: 'Malformed cache file found. The config needs to be parsed again!',
        outdatedCache: 'Outdated cache file found. The config needs to be parsed again!'
    }
}

export default function setupDisplayManager(opts: ShinyConfig, isCached: boolean): DisplayManager<ShinyConfig> {
    const display = new DisplayManager(opts, displayOptions)
    display.setBranch(isCached ? 'cached' : 'uncached')
    display.start()
    return display
}
