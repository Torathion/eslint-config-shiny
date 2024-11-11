import * as colors from 'yoctocolors'

export default function writeError(outStream: Error): void {
    process.stderr.write(Buffer.from(`\n${colors.red(outStream.stack ?? outStream.message)}\n`))
}
