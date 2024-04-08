import shiny from './dist/index.js'

console.log(await shiny({ configs: ['vue', 'format', 'vitest'] }))
