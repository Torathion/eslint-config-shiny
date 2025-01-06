import type { MaybeArray } from 'typestar'
import type { DisplayConfig, DisplayConfigOptions, DisplayEntry, DisplayEntryMap, ShinyConfig } from 'src/types'
import ora, { type Color, type Ora } from 'ora'
import { InactiveDisplayError } from 'src/errors'
import * as colors from 'yoctocolors'

function parseText(text: string, opts: ShinyConfig, startTime?: number): string {
    if (text.includes('%root%')) return text.replaceAll('%root%', opts.root)
    if (startTime && text.includes('%time%')) return text.replaceAll('%time%', `${Date.now() - startTime}ms`)
    return text
}

function handleText(text: string, opts: ShinyConfig, displayOpts?: DisplayConfigOptions): string {
    text = parseText(text, opts)
    if (!displayOpts) return text
    if (displayOpts.dots) return `${text}...`
    return text
}

function colorText(text: string, color: Color): string {
    return colors[color](text)
}

function addTask(task: DisplayEntry, texts: string[], colors: string[], opts: ShinyConfig, displayOpts?: DisplayConfigOptions) {
    texts.push(handleText(task.text, opts, displayOpts))
    colors.push(task.color)
}

function parseBranch(branch: MaybeArray<DisplayEntry>, texts: string[], colors: string[], opts: ShinyConfig, displayOpts?: DisplayConfigOptions) {
    if (Array.isArray(branch)) {
        const length = branch.length
        for (let i = 0; i < length; i++) addTask(branch[i], texts, colors, opts, displayOpts)
    } else addTask(branch, texts, colors, opts, displayOpts)
}

class DisplayBranch {
    colors: Color[]
    name: string
    step: number
    texts: string[]

    constructor(name: string, texts: string[], colors: Color[]) {
        this.name = name
        this.step = 0
        this.texts = texts
        this.colors = colors
    }

    getColor(step: number): Color {
        return this.colors[step]
    }

    getText(step: number): string {
        return colorText(this.texts[step], this.colors[step])
    }

    isDone(): boolean {
        return this.step >= this.texts.length
    }

    next(): void {
        this.step++
    }

    get currentColor(): Color {
        return this.getColor(this.step)
    }

    get currentText(): string {
        return this.getText(this.step)
    }
}

export default class DisplayTaskHandler {
    private activeBranch?: DisplayBranch
    private branches: Record<string, DisplayBranch> = {}
    private readonly completeMessage: string
    private readonly optionalTasks?: DisplayEntryMap
    private options?: DisplayConfigOptions
    private readonly spinner: Ora
    private startTime = -1

    constructor(opts: ShinyConfig, displayOptions: DisplayConfig) {
        this.spinner = ora()
        this.completeMessage = displayOptions.completeMessage
        this.optionalTasks = displayOptions.optional
        this.handleBranches(opts, displayOptions)
    }

    private displayNewTask(text: string, color: Color): void {
        const spinner = this.spinner
        spinner.succeed()
        spinner.text = text
        spinner.color = color
        spinner.start()
    }

    private handleBranches(shinyOpts: ShinyConfig, config: DisplayConfig): void {
        const branches = config.branches
        const generic = branches.generic
        const opts = (this.options = config.options)
        const keys = Object.keys(branches)
        let branch: MaybeArray<DisplayEntry>
        for (const key of keys) {
            branch = branches[key]
            const texts: string[] = []
            const colors: Color[] = []
            parseBranch(branch, texts, colors, shinyOpts, opts)
            if (generic) parseBranch(generic, texts, colors, shinyOpts, opts)
            this.branches[key] = new DisplayBranch(key, texts, colors)
        }
        this.activeBranch = this.branches[keys[0]]
    }

    finish(opts: ShinyConfig): void {
        const spinner = this.spinner
        spinner.succeed()
        spinner.color = 'green'
        spinner.text = colors.greenBright(parseText(this.completeMessage, opts, this.startTime))
        spinner.succeed()
    }

    next(): void {
        const activeBranch = this.activeBranch
        if (!activeBranch) throw new InactiveDisplayError()
        if (activeBranch.isDone()) return
        this.displayNewTask(activeBranch.currentText, activeBranch.currentColor)
        activeBranch.next()
    }

    optional(taskKey: string, opts: ShinyConfig): void {
        const optionalTasks = this.optionalTasks
        const task = optionalTasks?.[taskKey]
        if (!task) throw new Error(`No optional task named ${task} found.`)
        if (Array.isArray(task)) throw new Error("An optional task can't be in an array format.")
        this.displayNewTask(colorText(handleText(task.text, opts, this.options), task.color as Color), task.color as Color)
    }

    setBranch(key: string): void {
        const spinner = this.spinner
        if (spinner.isSpinning) spinner.stop()
        const branches = this.branches
        if (!branches[key]) throw new Error(`No process branch ${key} found.`)
        this.activeBranch = branches[key]
    }

    start(): void {
        const activeBranch = this.activeBranch
        if (!activeBranch) throw new InactiveDisplayError()
        const spinner = this.spinner
        spinner.color = activeBranch.currentColor
        if (this.startTime === -1) this.startTime = Date.now()
        spinner.text = activeBranch.currentText
        spinner.color = activeBranch.currentColor
        spinner.start()
        activeBranch.next()
    }

    warn(text: string): void {
        const spinner = this.spinner
        const prevColor = spinner.color
        spinner.color = 'yellow'
        spinner.warn(colorText(text, 'yellow'))
        spinner.color = prevColor
        spinner.start()
    }
}
