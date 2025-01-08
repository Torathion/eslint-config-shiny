import type { DisplayConfig, ShinyConfig } from 'src/types'
import { join } from 'node:path'
import { DisplayTaskHandler } from 'src/handler'

const displayOptions: DisplayConfig = {
    branches: {
        cached: [
            { color: 'yellow', text: 'Validating cache file' },
            { color: 'cyan', text: 'Applying cache' }
        ],
        generic: { color: 'magenta', text: 'Optimizing configs' },
        uncached: [
            { color: 'yellow', text: 'Fetching configs' },
            { color: 'cyan', text: 'Applying plugins' },
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
    }
}

export default function setupDisplayManager(opts: ShinyConfig, isCached: boolean): DisplayTaskHandler<ShinyConfig> {
    const display = new DisplayTaskHandler(opts, displayOptions)
    display.setBranch(isCached ? 'cached' : 'uncached')
    display.start()
    return display
}
