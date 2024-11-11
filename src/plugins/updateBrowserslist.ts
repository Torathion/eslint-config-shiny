import type DisplayTaskHandler from 'src/handler/DisplayTaskHandler'
import { clearLastConsoleLine, runCommand, writeToConsole } from 'src/utils'

export default async function updateBrowsersList(display: DisplayTaskHandler): Promise<void> {
    display.display('Updating Browserslist...')
    const { stderr, stdout } = await runCommand('npx update-browserslist-db@latest')
    clearLastConsoleLine()
    writeToConsole(stderr.length ? stderr : stdout)
}
