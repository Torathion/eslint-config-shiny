type UnionToIntersection<T> = (T extends any ? (x: T) => void : never) extends (x: infer U) => void ? U : never

type ArrayToIntersection<T extends any[]> = UnionToIntersection<T[number]>
type ArrayToUnion<T extends any[]> = T[number]

const stuff = [{ a: 1 }, { b: 2 }, { c: 3 }] as const

const x = stuff as ArrayToUnion<typeof stuff>
