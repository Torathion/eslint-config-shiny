import { dirname, relative, resolve } from 'node:path'
import type { ShinyConfig } from 'src/types/interfaces'
import { find, safeGetFileHandle } from 'node-comb'
import Promeister from 'promeister'

const escapeRegex = /(?=((?:\\.|[^{(])*))\1([{(])/guy
const uncleDirRegex = /^(\.\.\/)+$/
const SpecialPatternValues = new Set(['', '**', '**/', '/**'])
const RelativeMatchValues = new Set(['', '.', '/'])

export default async function parseIgnoreFiles(opts: ShinyConfig): Promise<string[]> {
  const len = opts.ignoreFiles.length
  const paths: Promise<string>[] = new Array(len)
  // 1. Search for all paths
  for (let i = 0; i < len; i++) paths[i] = find(opts.ignoreFiles[i])
  const filesPaths = await Promeister.all(paths)
  const patternPromises: Promise<string[]>[] = new Array(len)
  // 2. Parse the entire content of each file
  for (let i = 0; i < len; i++) patternPromises[i] = handleFile(filesPaths[i], opts.root)
  return [...new Set((await Promeister.all(patternPromises)).flat())]
}

function cleanPattern(pattern: string, isNegated: boolean): string {
  return (isNegated ? pattern.slice(1) : pattern).trimEnd()
}

function convertIgnorePattern(pattern: string): string {
  const isNegated = pattern[0] === '!'
  const negatePrefix = isNegated ? '!' : ''
  const testPattern = cleanPattern(pattern, isNegated)
  if (SpecialPatternValues.has(testPattern)) return `${negatePrefix}${testPattern}`
  const slashIndex = testPattern.indexOf('/')
  const anyPrefix = slashIndex === -1 || slashIndex === testPattern.length - 1 ? '**/' : ''
  /*
   * Escape `{` and `(` because in gitignore patterns they are just
   * literal characters without any specific syntactic meaning,
   * while in minimatch patterns they can form brace expansion or extglob syntax.
   *
   * For example, gitignore pattern `src/{a,b}.js` ignores file `src/{a,b}.js`.
   * But, the same minimatch pattern `src/{a,b}.js` ignores files `src/a.js` and `src/b.js`.
   * Minimatch pattern `src/\{a,b}.js` is equivalent to gitignore pattern `src/{a,b}.js`.
   */
  const escapedPattern = (slashIndex === 0 ? testPattern.slice(1) : testPattern).replaceAll(escapeRegex, '$1\\$2')
  return `${negatePrefix}${anyPrefix}${escapedPattern}${testPattern.endsWith('/**') ? '/*' : ''}`
}

async function handleFile(filePath: string, root: string): Promise<string[]> {
  const file = await safeGetFileHandle(filePath, 'r')
  if (!file) return []
  const relativePath = relative(root, dirname(filePath)).replaceAll('\\', '/')
  const ignorePatterns: string[] = []
  let glob: string | undefined
  for await (const pattern of file.readLines()) {
    if (!pattern.length || pattern[0] === '#') continue
    glob = relativeMatch(convertIgnorePattern(pattern), relativePath, root)
    if (!glob) continue
    ignorePatterns.push(glob)
  }
  await file.close()
  return ignorePatterns
}

function hasAnyDepth(pattern: string): boolean {
  return pattern.length > 1 && pattern[0] === '*' && pattern[1] === '*'
}

function relativeMatch(pattern: string, relativePath: string, cwd: string): string | undefined {
  // if gitignore is in the current directory leave it as is
  if (RelativeMatchValues.has(relativePath)) return pattern
  const isNegated = pattern[0] === '!'
  const negated = isNegated ? '!' : ''
  let cleanedPattern = cleanPattern(pattern, isNegated)
  if (relativePath.at(-1) !== '/') relativePath = `${relativePath}/`
  // child directories need to just add path in start
  if (relativePath[0] !== '.' && relativePath[1] !== '.') return `${negated}${relativePath}${cleanedPattern}`
  // uncle directories don't make sense
  if (!uncleDirRegex.test(relativePath)) throw new Error('The ignore file location should be either a parent or child directory')
  if (hasAnyDepth(cleanedPattern)) return pattern
  // if glob doesn't match the parent dirs it should be ignored
  const parents = relative(resolve(cwd, relativePath), cwd).split(/[/\\]/)
  let currentParent = parents[0]
  while (parents.length && cleanedPattern.startsWith(`${currentParent}/`)) {
    cleanedPattern = cleanedPattern.slice(currentParent.length + 1)
    parents.shift()
    currentParent = parents[0]
  }
  //  if all parents are out or has any depth, it's clean, otherwise it doesn't matches the current folder
  return !parents.length || hasAnyDepth(cleanedPattern) ? `${negated}${cleanedPattern}` : undefined
}
