export default function except<T>(array: T[], elementsToRemove: T[]): T[] {
    const elLen = elementsToRemove.length
    if (!elLen || !array.length) return array.slice()

    let index: number
    for (let i = 0; i < elLen; i++) {
        index = array.indexOf(elementsToRemove[i])
        if (index > -1) array.splice(index, 1)
        if (!array.length) return []
    }
    return array.slice()
}
