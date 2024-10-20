const plugins = {
    '@eslint-react/debug': 0,
    '@eslint-react/dom': 1,
    '@eslint-react/hooks-extra': 2,
    '@eslint-react/naming-convention': 3,
    '@eslint-react/web-api': 4
}
const renames = {
    '@arthurgeron/react-usememo': 'use-memo',
    '@eslint-react': 'react',
    '@microsoft/sdl': 'sdl',
    '@stylistic/js': 'styleJs',
    '@stylistic/jsx': 'styleJsx',
    '@stylistic/ts': 'styleTs',
    '@typescript-eslint': 'ts'
}

export default function renamePlugins(plugins, renames) {
    if (!plugins) return plugins
    for (const name of Object.keys(plugins)) {
        for (const key of Object.keys(renames)) {
            if (name.startsWith(key)) {
                plugins[name.replace(key, renames[key])] = plugins[name]
                delete plugins[name]
            }
        }
    }
    return plugins
}

console.time('renamePlugins')
renamePlugins(plugins, renames)
console.timeEnd('renamePlugins')
