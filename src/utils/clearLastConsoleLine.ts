const escape = '\u001B['

export default function clearLastConsoleLine(): void {
  process.stdout.write(`${escape}A`)
  process.stdout.write(`${escape}K`)
}
