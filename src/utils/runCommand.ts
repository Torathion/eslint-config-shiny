import { promisify } from 'node:util'
import { exec } from 'node:child_process'

const pExec = promisify(exec)

export default async function runCommand(commandString: string): Promise<{ stdout: string; stderr: string }> {
    return await pExec(commandString)
}
