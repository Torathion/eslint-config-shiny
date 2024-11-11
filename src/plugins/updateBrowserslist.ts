import type DisplayTaskHandler from 'src/handler/DisplayTaskHandler'
import type { ShinyConfig } from 'src/types'
import { clearLastConsoleLine, runCommand, writeToConsole } from 'src/utils'

export default async function updateBrowsersList(opts: ShinyConfig, display: DisplayTaskHandler): Promise<void> {
    display.optional('updateBrowserList', opts)
    const { stderr, stdout } = await runCommand('npx update-browserslist-db@latest')
    clearLastConsoleLine()
    writeToConsole(stderr.length ? stderr : stdout)
}
