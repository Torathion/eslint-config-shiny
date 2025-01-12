import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const pExec = promisify(exec)

export default async function runCommand(commandString: string): Promise<{ stderr: string; stdout: string }> {
    return pExec(commandString)
}
