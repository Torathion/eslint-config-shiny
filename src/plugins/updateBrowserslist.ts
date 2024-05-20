import runCommand from 'src/utils/runCommand'
import writeToConsole from 'src/utils/writeToConsole'

export default async function updateBrowsersList(): Promise<void> {
    process.stdout.write(Buffer.from('\nUpdating Browserslist...\n'))
    const { stdout, stderr } = await runCommand('npx update-browserslist-db@latest')
    writeToConsole(stderr.length ? stderr : stdout)
}
