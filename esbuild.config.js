import { build } from 'esbuild'

await build({
    entryPoints: ['./src/index.ts', './src/profiles/*'],
    bundle: true,
    minify: false,
    platform: 'node',
    sourcemap: true,
    outdir: '/dist',
    format: 'esm',
    target: 'esnext',
    logLevel: 'info',
    packages: 'external'
}).catch(err => {
    console.error(err)
})
