import type { Linter } from 'eslint'
import { mergeArr } from 'compresso'

type PreProcessed = (Linter.ProcessorFile | string)[]

export default function mergeProcessors(processors: Linter.Processor[]): Linter.Processor {
    const cache = new Map<string, number[]>()
    const length = processors.length

    let nameString = `merged-processor:${processors[0].meta?.name ?? 'unknown'}`
    for (let i = 1; i < length; i++) {
        nameString = `${nameString}+${processors[i].meta?.name ?? 'unknown'}`
    }

    return {
        meta: {
            name: nameString
        },
        postprocess(messages: Linter.LintMessage[][], fileName: string): Linter.LintMessage[] {
            const counts = cache.get(fileName)!
            const newMessages: Linter.LintMessage[] = []
            cache.delete(fileName)
            let index = 0
            let msgs: Linter.LintMessage[][]
            for (let i = 0; i < length; i++) {
                msgs = messages.slice(index, index + counts[i])
                index += counts[i]
                mergeArr(newMessages, processors[i].postprocess?.(msgs, fileName) ?? [])
            }
            return newMessages
        },
        preprocess(text: string, fileName: string): PreProcessed {
            const counts: number[] = new Array(length)
            const newProcessors: PreProcessed = []
            cache.set(fileName, counts)
            let res: PreProcessed
            for (let i = 0; i < length; i++) {
                res = processors[i].preprocess?.(text, fileName) ?? []
                counts[i] = res.length
                mergeArr(newProcessors, res)
            }
            return newProcessors
        },
        supportsAutofix: true
    }
}
