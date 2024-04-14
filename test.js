function isEmpty1(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false
        }
    }

    return true
}

function isEmpty2(obj) {
    return !Object.keys(obj).length
}

function isEmpty3(obj) {
    for (const x in obj) {
        return false
    }
    return true
}

console.time('hasOwn')
for (let i = 0; i < 10000; i++) isEmpty1({})
console.timeEnd('hasOwn')
console.time('keys')
for (let i = 0; i < 10000; i++) isEmpty2({})
console.timeEnd('keys')
console.time('for in')
for (let i = 0; i < 10000; i++) isEmpty3({})
console.timeEnd('for in')

console.time('hasOwn false')
for (let i = 0; i < 10000; i++) isEmpty1({ a: 2 })
console.timeEnd('hasOwn false')
console.time('keys false')
for (let i = 0; i < 10000; i++) isEmpty2({ a: 2 })
console.timeEnd('keys false')
console.time('for in false')
for (let i = 0; i < 10000; i++) isEmpty3({ a: 2 })
console.timeEnd('for in false')

console.time('hasOwn false')
for (let i = 0; i < 10000; i++) isEmpty1({ a: 2, b: 3 })
console.timeEnd('hasOwn false')
console.time('keys false')
for (let i = 0; i < 10000; i++) isEmpty2({ a: 2, b: 3 })
console.timeEnd('keys false')
console.time('for in false')
for (let i = 0; i < 10000; i++) isEmpty3({ a: 2, b: 3 })
console.timeEnd('for in false')
