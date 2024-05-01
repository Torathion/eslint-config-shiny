import { join } from 'node:path'
import ora, { type Color } from 'ora'
import hasCache from 'src/guards/hasCache'
import type { ShinyConfig } from 'src/types/interfaces'
import * as colors from 'yoctocolors'

const noCacheTexts = [colors.yellow('Fetching configs...'), colors.cyan('Applying plugins...'), colors.blueBright('Parsing profiles...')]
const cacheTexts = [colors.yellow('Applying cache...')]
const spinnerColors: Color[] = ['yellow', 'cyan', 'blue']

export default function* displayTask(opts: ShinyConfig): Generator<void> {
    const start = Date.now()
    if (opts.cache && !hasCache(opts)) {
        noCacheTexts.push(colors.magentaBright(`Caching final config under ${join(opts.root, '.temp', 'shiny-config.json')}`))
        spinnerColors.push('magenta')
    }
    const usedTexts = hasCache(opts) ? cacheTexts : noCacheTexts
    const spinner = ora(usedTexts[0])
    spinner.color = spinnerColors[0]
    spinner.start()
    yield
    const len = usedTexts.length
    let i
    for (i = 1; i < len; i++) {
        spinner.succeed()
        spinner.color = spinnerColors[i]
        spinner.text = usedTexts[i]
        spinner.start()
        yield
    }
    spinner.color = 'green'
    spinner.text = colors.greenBright(`Ready to lint after ${Date.now() - start}ms!`)
    spinner.succeed()
}
