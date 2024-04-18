import { existsSync } from 'fs'
import { mkdir, open, writeFile } from 'fs/promises'
import { cwd } from 'src/constants'

const VSCodePatch = {
    'eslint.experimental.useFlatConfig': true,
    // Auto fix
    'editor.codeActionsOnSave': {
        'source.fixAll.eslint': 'explicit'
    },
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

export default async function patchVSCode(): Promise<void> {
    const vsCodeFolderPath = `${cwd}/.vscode`
    const settingsPath = `${vsCodeFolderPath}/settings.json`
    if (!existsSync(vsCodeFolderPath)) await mkdir(vsCodeFolderPath)
    if (!existsSync(settingsPath)) await writeFile(settingsPath, JSON.stringify(VSCodePatch), 'utf8')
    else {
        const file = await open(settingsPath, 'r+')
        const settings = JSON.parse((await file.readFile()).toString())
        let shouldWrite = true
        for (const key in keys) {
            if (settings[key]) {
                shouldWrite = false
                break
            }
        }
        if (shouldWrite) await file.writeFile(JSON.stringify(Object.assign(settings, VSCodePatch)))
        await file.close()
    }
}
