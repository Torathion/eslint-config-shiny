import ora, { type Color } from 'ora'
import * as colors from 'yoctocolors'

const texts = [colors.yellow('Fetching configs...'), colors.cyan('Applying plugins...'), colors.blueBright('Parsing profiles...')]
const spinnerColors: Color[] = ['yellow', 'cyan', 'blue']

export default function* displayTask(): Generator<void> {
    const start = Date.now()
    const spinner = ora(texts[0])
    spinner.color = spinnerColors[0]
    spinner.start()
    yield
    const len = texts.length
    let i
    for (i = 1; i < len; i++) {
        spinner.succeed()
        spinner.color = spinnerColors[i]
        spinner.text = texts[i]
        spinner.start()
        yield
    }
    spinner.color = 'green'
    spinner.text = colors.greenBright(`Ready to lint after ${Date.now() - start}ms!`)
    spinner.succeed()
}
