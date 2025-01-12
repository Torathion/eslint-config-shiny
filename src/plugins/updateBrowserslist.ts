import type DisplayManager from 'src/handler/DisplayManager'
import type { ShinyConfig } from 'src/types'
import { clearLastConsoleLine, runCommand, writeToConsole } from 'src/utils'

export default async function updateBrowsersList(display: DisplayManager<ShinyConfig>): Promise<void> {
    display.optional('updateBrowserList')
    const { stderr, stdout } = await runCommand('npx update-browserslist-db@latest')
    clearLastConsoleLine()
    writeToConsole(stderr.length ? stderr : stdout)
}
