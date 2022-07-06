function isNum(val) {
    return !isNaN(val)
}
const isValidString = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true;
}

let regexName = /^[A-Za-z. -]+$/
let regexPhone = /^[6789]\d{9}$/
let regexPincode = /^\d{6}$/
let regexEmail = /^[a-z0-9]{2,}@+[a-z]{3,5}\.[a-z]{2,3}$/


module.exports= {isNum, isValidString }
module.exports= { regexName, regexPhone, regexPincode, regexEmail}