import { join } from 'node:path'
import ora, { type Color, type Ora } from 'ora'
import hasCache from 'src/guards/hasCache'
import type { ShinyConfig } from 'src/types/interfaces'
import * as colors from 'yoctocolors'

const genericTexts = [colors.magenta('Optimizing configs...')]
const noCacheTexts = [
    colors.yellow('Fetching configs...'),
    colors.cyan('Applying plugins...'),
    colors.blueBright('Parsing profiles...'),
    ...genericTexts
]
const cacheTexts = [colors.yellow('Applying cache...'), ...genericTexts]
const spinnerColors: Color[] = ['yellow', 'cyan', 'blue']

export default class DisplayTaskHandler {
    colors: Color[]
    spinner: Ora
    startTime: number
    step: number
    texts: string[]

    constructor(opts: ShinyConfig) {
        const hasCacheFlag = hasCache(opts)
        this.texts = hasCacheFlag ? cacheTexts : noCacheTexts
        this.colors = spinnerColors
        if (opts.cache && !hasCacheFlag) {
            this.texts.push(colors.magentaBright(`Caching final config under ${join(opts.root, '.temp', 'shiny-config.json')}`))
            this.colors.push('magenta')
        }
        this.spinner = ora(this.texts[0])
        this.step = 0
        this.startTime = Date.now()
    }

    display(text: string, color?: Color): void {
        const spinner = this.spinner
        const spinnerColor = color ?? this.colors[this.step - 1]
        spinner.succeed()
        spinner.text = colors[spinnerColor](text)
        spinner.color = spinnerColor
        spinner.start()
    }

    finish(): void {
        const spinner = this.spinner
        spinner.succeed()
        spinner.color = 'green'
        spinner.text = colors.greenBright(`Ready to lint after ${Date.now() - this.startTime}ms!`)
        spinner.succeed()
    }

    next(): void {
        const spinner = this.spinner
        const step = this.step
        spinner.succeed()
        if (step + 1 > this.texts.length) return
        spinner.text = this.texts[step]
        spinner.color = this.colors[step]
        this.step++
        spinner.start()
    }

    start(): void {
        const spinner = this.spinner
        spinner.color = this.colors[0]
        spinner.start()
        this.step++
    }
}
