import { build } from 'esbuild'

await build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'node',
    outdir: '/dist',
    format: 'esm',
    target: 'esnext',
    logLevel: 'info'
}).catch(err => {
    console.error(err)
})
