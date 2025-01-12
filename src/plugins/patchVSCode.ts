import type DisplayManager from 'src/handler/DisplayManager'
import type { ShinyConfig } from 'src/types/interfaces'
import type { AnyObject } from 'typestar'
import { existsSync } from 'node:fs'
import { mkdir, open, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileToJson } from 'src/utils'

const VSCodePatch: AnyObject = {
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
    'eslint.useFlatConfig': true,
    // Enable eslint for all supported languages
    'eslint.validate': [
        'javascript',
        'javascriptreact',
        'typescript',
        'typescriptreact',
        'vue',
        'html',
        'markdown',
        'json',
        'json5',
        'jsonc',
        'yaml',
        'toml',
        'xml',
        'gql',
        'graphql',
        'astro',
        'css',
        'less',
        'scss',
        'pcss',
        'postcss'
    ],
    'files.autoSave': 'onFocusChange', // optional, but recommended
    // Disable the default formatter, use eslint instead
    'prettier.enable': false
}

const VSCodeKeys = Object.keys(VSCodePatch)
const rules = ['style/*', 'format/*', '*-indent', '*-spacing', '*-spaces', '*-order', '*-dangle', '*-newline', '*-style', '*quotes', '*semi']

function buildRuleCustomizations(): void {
    const length = rules.length
    const arr = (VSCodePatch['eslint.rules.customizations'] = new Array(length))
    for (let i = 0; i < length; i++) {
        arr[i] = { fixable: true, rule: rules[i], severity: 'off' }
    }
}

export default async function patchVSCode(opts: ShinyConfig, display: DisplayManager<ShinyConfig>): Promise<void> {
    display.optional('patchVSCode')
    const vsCodeFolderPath = join(opts.root, '.vscode')
    const settingsPath = join(vsCodeFolderPath, 'settings.json')
    if (!existsSync(vsCodeFolderPath)) await mkdir(vsCodeFolderPath)
    // Silent the stylistic rules in you IDE, but still auto fix them
    buildRuleCustomizations()
    if (!existsSync(settingsPath)) {
        await writeFile(settingsPath, JSON.stringify(VSCodePatch), 'utf8')
        // Newly created settings file. No need to check it any further
        return
    }
    const file = await open(settingsPath, 'r+')
    const settings = await fileToJson(file)
    const settingsKeys = Object.keys(settings)
    let shouldWrite = true
    for (const key of settingsKeys) {
        // A separate config in an unusual place has been found. Report it!
        if (key === 'eslint.options') display.warn('eslintFound')
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
