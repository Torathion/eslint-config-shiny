export const ExcludeGlobs = [
    '**/node_modules',
    '**/dist',
    '**/build',
    '**/bin',
    '**/package-lock.json',
    '**/yarn.lock',
    '**/pnpm-lock.yaml',
    '**/bun.lockb',
    '**/output',
    '**/coverage',
    '**/temp',
    '**/.temp',
    '**/tmp',
    '**/.tmp',
    '**/.history',
    '**/.vitepress/cache',
    '**/.nuxt',
    '**/.next',
    '**/.vercel',
    '**/.changeset',
    '**/.idea',
    '**/.vscode',
    '**/.cache',
    '**/.env',
    '**/.output',
    '**/.vite-inspect',
    '**/.yarn',
    '**/CHANGELOG*.md',
    '**/*.min.*',
    '**/LICENSE*',
    '**/__snapshots__',
    '**/*.d.ts'
]

export const ExtensionGlob = '?([cm])[jt]s?(x)'
export const StyleGlob = '**/*.{c,le,sc,sa}ss'
export const SrcGlob = `**/*${ExtensionGlob}`
export const TestGlobs = [
    `**/__tests__/**/*.${ExtensionGlob}`,
    `**/*.spec.${ExtensionGlob}`,
    `**/*.test.${ExtensionGlob}`,
    `**/*.bench.${ExtensionGlob}`,
    `**/*.benchmark.${ExtensionGlob}`
]
