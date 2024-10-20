import getPackageJson from './getPackageJson'

export default async function getRepoVersion(): Promise<string> {
    const handle = await getPackageJson()
    if (!handle) return ''
    let trimmedLine: string
    for await (const line of handle.readLines()) {
        trimmedLine = line.trim()
        if (trimmedLine.startsWith('"version"')) {
            return trimmedLine.substring(trimmedLine.indexOf(':') + 1, trimmedLine.length - 1).replaceAll('"', '')
        }
    }
    await handle.close()
    return ''
}
