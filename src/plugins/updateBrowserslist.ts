import type DisplayTaskHandler from 'src/handler/DisplayTaskHandler'
import clearLastConsoleLine from 'src/utils/clearLastConsoleLine'
import runCommand from 'src/utils/runCommand'
import writeToConsole from 'src/utils/writeToConsole'

export default async function updateBrowsersList(display: DisplayTaskHandler): Promise<void> {
    display.display('Updating Browserslist...')
    const { stderr, stdout } = await runCommand('npx update-browserslist-db@latest')
    clearLastConsoleLine()
    writeToConsole(stderr.length ? stderr : stdout)
}
