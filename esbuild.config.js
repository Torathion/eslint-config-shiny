import { build } from 'esbuild'

await build({
    entryPoints: ['./src/index.ts', './src/profiles/*'],
    bundle: true,
    minify: true,
    platform: 'node',
    outdir: '/dist',
    format: 'esm',
    target: 'esnext',
    logLevel: 'info',
    packages: 'external'
}).catch(err => {
    console.error(err)
})
