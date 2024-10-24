function countSlashes(str) {
    const matches = str.match(/\//g)
    return matches ? matches.length : 0
}

console.log(countSlashes('arrow-body-style'))
