export default function writeToConsole(outStream: string): void {
    process.stdout.write(Buffer.from(`\n${outStream}\n`))
}
