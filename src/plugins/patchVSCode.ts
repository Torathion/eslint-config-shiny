import { existsSync } from 'node:fs'
import { mkdir, open, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { ShinyConfig } from 'src/types/interfaces'
import fileToJson from 'src/utils/fileToJson'

const VSCodePatch = {
    // Auto fix
    'editor.codeActionsOnSave': {
        'source.fixAll.eslint': 'explicit'
    },
    'eslint.experimental.useFlatConfig': true,
    // Silent the stylistic rules in you IDE, but still auto fix them
    'eslint.rules.customizations': [
        { rule: 'style/*', severity: 'off' },
        { rule: 'format/*', severity: 'off' },
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
        'json',
        'jsonc',
        'yaml',
        'toml',
        'astro'
    ]
}

const keys = Object.keys(VSCodePatch)

export default async function patchVSCode(opts: ShinyConfig): Promise<void> {
    const vsCodeFolderPath = join(opts.root, '.vscode')
    const settingsPath = join(vsCodeFolderPath, 'settings.json')
    if (!existsSync(vsCodeFolderPath)) await mkdir(vsCodeFolderPath)
    if (!existsSync(settingsPath)) await writeFile(settingsPath, JSON.stringify(VSCodePatch), 'utf8')
    const file = await open(settingsPath, 'r+')
    const settings = await fileToJson(file)
    let shouldWrite = true
    for (const key of keys) {
        // only write when there are no eslint keys inside the settings.json
        if (settings[key]) {
            shouldWrite = false
            break
        }
    }
    if (shouldWrite) {
        const buffer = Buffer.from(JSON.stringify(Object.assign(settings, VSCodePatch)))
        await file.write(buffer, 0, buffer.byteLength, 0)
    }
    await file.close()
}
