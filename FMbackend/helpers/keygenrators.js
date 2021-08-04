const crypto=require('crypto')
const accesskey=crypto.randomBytes(32).toString('hex')
const refreshkey=crypto.randomBytes(32).toString('hex')
console.table({accesskey,refreshkey})