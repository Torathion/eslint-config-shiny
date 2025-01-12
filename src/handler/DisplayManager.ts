import type { DisplayConfig, DisplayConfigOptions, DisplayEntry, DisplayEntryMap, ToolOptions } from 'src/types'
import type { Dict, MaybeArray } from 'typestar'
import ora, { type Color, type Ora } from 'ora'
import { GlobalPJStore } from 'src/constants'
import { InactiveDisplayError, UnknownDisplayKeyError } from 'src/errors'
import * as colors from 'yoctocolors'

function parseText<T extends ToolOptions>(text: string, opts: T, startTime?: number): string {
    if (text.includes('%root%')) return text.replaceAll('%root%', opts.root)
    if (startTime && text.includes('%time%')) return text.replaceAll('%time%', `${Date.now() - startTime}ms`)
    return text
}

function handleText<T extends ToolOptions>(text: string, opts: T, displayOpts?: DisplayConfigOptions): string {
    text = parseText(text, opts)
    if (!displayOpts) return text
    if (displayOpts.dots) return `${text}...`
    return text
}

function colorText(text: string, color: Color): string {
    return colors[color](text)
}

function addTask<T extends ToolOptions>(task: DisplayEntry, texts: string[], displayColors: string[], opts: T, displayOpts?: DisplayConfigOptions) {
    texts.push(handleText(task.text, opts, displayOpts))
    displayColors.push(task.color)
}

function parseBranch<T extends ToolOptions>(
    branch: MaybeArray<DisplayEntry>,
    texts: string[],
    displayColors: string[],
    opts: T,
    displayOpts?: DisplayConfigOptions
): void {
    if (Array.isArray(branch)) {
        const length = branch.length
        for (let i = 0; i < length; i++) addTask(branch[i], texts, displayColors, opts, displayOpts)
    } else addTask(branch, texts, displayColors, opts, displayOpts)
}

class DisplayBranch {
    displayColors: Color[]
    name: string
    step: number
    texts: string[]

    constructor(name: string, texts: string[], displayColors: Color[]) {
        this.name = name
        this.step = 0
        this.texts = texts
        this.displayColors = displayColors
    }

    getColor(step: number): Color {
        return this.displayColors[step]
    }

    getText(step: number): string {
        return colorText(this.texts[step], this.displayColors[step])
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

export default class DisplayManager<T extends ToolOptions> {
    private activeBranch?: DisplayBranch
    private branches: Record<string, DisplayBranch> = {}
    private readonly messages: Dict
    private readonly warnings: Dict
    private readonly optionalTasks?: DisplayEntryMap
    private options?: DisplayConfigOptions
    private readonly spinner: Ora
    private startTime = -1
    private readonly toolOptions: T

    constructor(opts: T, displayOptions: DisplayConfig) {
        this.spinner = ora()
        this.messages = displayOptions.messages
        this.optionalTasks = displayOptions.optional
        this.warnings = displayOptions.warnings
        this.toolOptions = opts
        this.handleBranches(displayOptions)
    }

    private displayNewTask(text: string, color: Color): void {
        const spinner = this.spinner
        spinner.succeed()
        spinner.text = text
        spinner.color = color
        spinner.start()
    }

    private handleBranches(config: DisplayConfig): void {
        const toolOpts = this.toolOptions
        const branches = config.branches
        const generic = branches.generic
        const opts = (this.options = config.options)
        const keys = Object.keys(branches)
        let branch: MaybeArray<DisplayEntry>
        for (const key of keys) {
            branch = branches[key]
            const texts: string[] = []
            const displayColors: Color[] = []
            parseBranch(branch, texts, displayColors, toolOpts, opts)
            if (generic) parseBranch(generic, texts, displayColors, toolOpts, opts)
            this.branches[key] = new DisplayBranch(key, texts, displayColors)
        }
        this.activeBranch = this.branches[keys[0]]
    }

    async abort(): Promise<void> {
        const spinner = this.spinner
        spinner.stop()
        spinner.warn(colorText(`${(await GlobalPJStore.getCurrentPackage()).name} is finishing gracefully...`, 'yellow'))
    }

    finish(key: string): void {
        const msg = this.messages[key]
        if (!msg) throw new UnknownDisplayKeyError(key)
        const spinner = this.spinner
        spinner.succeed()
        spinner.color = 'green'
        spinner.text = colors.greenBright(parseText(msg, this.toolOptions, this.startTime))
        spinner.succeed()
    }

    next(): void {
        const activeBranch = this.activeBranch
        if (!activeBranch) throw new InactiveDisplayError()
        if (activeBranch.isDone()) return
        this.displayNewTask(activeBranch.currentText, activeBranch.currentColor)
        activeBranch.next()
    }

    optional(key: string): void {
        const optionalTasks = this.optionalTasks
        const task = optionalTasks?.[key]
        if (!task) throw new UnknownDisplayKeyError(key)
        if (Array.isArray(task)) throw new Error("An optional task can't be in an array format.")
        this.displayNewTask(colorText(handleText(task.text, this.toolOptions, this.options), task.color as Color), task.color as Color)
    }

    setBranch(key: string): void {
        const spinner = this.spinner
        if (spinner.isSpinning) spinner.stop()
        const branches = this.branches
        if (!branches[key]) throw new UnknownDisplayKeyError(key)
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

    warn(key: string): void {
        const warn = this.warnings[key]
        if (!warn) throw new UnknownDisplayKeyError(key)
        const spinner = this.spinner
        const prevColor = spinner.color
        spinner.color = 'yellow'
        spinner.warn(colorText(warn, 'yellow'))
        spinner.color = prevColor
        spinner.start()
    }
}
