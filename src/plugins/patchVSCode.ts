import { existsSync } from 'node:fs'
import { mkdir, open, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { yellow } from 'yoctocolors'
import type DisplayTaskHandler from 'src/handler/DisplayTaskHandler'
import type { ShinyConfig } from 'src/types/interfaces'
import { fileToJson, writeToConsole } from 'src/utils'

const VSCodePatch = {
    // Auto fix
    'editor.codeActionsOnSave': {
        'source.fixAll.eslint': 'explicit'
    },
    // Recommended rules copied from eslint prettier
    'editor.defaultFormatter': 'rvest.vs-code-prettier-eslint',
    'editor.formatOnPaste': true, // optional
    'editor.formatOnSave': true, // optional
    'editor.formatOnSaveMode': 'file', // required to format on save
    'editor.formatOnType': false, // required
    'eslint.experimental.useFlatConfig': true,
    // Silent the stylistic rules in you IDE, but still auto fix them
    'eslint.rules.customizations': [
        { rule: 'style/*', severity: 'off' },
        { rule: 'format/*', severity: 'off' },
        { rule: '*-style', severity: 'off' },
        { rule: '*-indent', severity: 'off' },
        { rule: '*-spacing', severity: 'off' },
        { rule: '*-spaces', severity: 'off' },
        { rule: '*-order', severity: 'off' },
        { rule: '*-dangle', severity: 'off' },
        { rule: '*-newline', severity: 'off' },
        { rule: '*quotes', severity: 'off' },
        { rule: '*semi', severity: 'off' }
    ],
    // Enable eslint for all supported languages
    'eslint.validate': [
        'javascript',
        'javascriptreact',
        'typescript',
        'typescriptreact',
        'vue',
        'html',
        'markdown',
        'jsonc',
        'yaml',
        'toml',
        'astro'
    ],
    'files.autoSave': 'onFocusChange', // optional but recommended
    'vs-code-prettier-eslint.prettierLast': false // set as "true" to run 'prettier' last not first
}

const VSCodeKeys = Object.keys(VSCodePatch)

export default async function patchVSCode(opts: ShinyConfig, display: DisplayTaskHandler): Promise<void> {
    display.display('Patching VSCode...')
    const vsCodeFolderPath = join(opts.root, '.vscode')
    const settingsPath = join(vsCodeFolderPath, 'settings.json')
    if (!existsSync(vsCodeFolderPath)) await mkdir(vsCodeFolderPath)
    if (!existsSync(settingsPath)) await writeFile(settingsPath, JSON.stringify(VSCodePatch), 'utf8')
    const file = await open(settingsPath, 'r+')
    const settings = await fileToJson(file)
    const settingsKeys = Object.keys(settings)
    let shouldWrite = true
    for (const key of settingsKeys) {
        // A separate config in an unusual place has been found. Report it!
        if (key === 'eslint.options')
            writeToConsole(yellow('eslint.options were found in your vscode settings.json. Please merge this config into your eslint.config.js'))
        // only write when there are no eslint keys inside the settings.json
        if (VSCodeKeys.includes(key)) shouldWrite = false
    }
    if (shouldWrite) {
        const buffer = Buffer.from(JSON.stringify(Object.assign(settings, VSCodePatch)))
        await file.truncate(0)
        await file.write(buffer, 0, buffer.byteLength, 0)
    }
    await file.close()
}
