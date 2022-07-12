const mongoose  = require("mongoose")

//******************* validation Empty String ******************/

const isValidString = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value !== "string" || value.trim().length === 0) return false //""
    return true;
}



//******************* validation for Valid Mongoose ID ******************/

const isValidObjectId = function (value){
    return mongoose.Types.ObjectId.isValid(value) 

}



//******************* validation for Subcategory ******************/

const validateSubCategory = (subcategory) => {
    if (!Array.isArray(subcategory)) {
        return subcategory.replace("[", "").replace("]", "").replace("{", "").replace("}", "").trim().split(",").filter((subcategory) => {
            return subcategory !== ""
        })
    }
    return subcategory.join(",").replace("[", "").replace("]", "").replace("{", "").replace("}", "").trim().split(",").filter((subcategory) => {
        return subcategory !== ""
    })
}



//******************* validation for password ******************/

const validatePassword = (password, res) => {
    let regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*])[a-z0-9!@#$%^&*]{8,15}$/
    if (!regex.test(password)) {
        res.status(400).send({ status: false, msg: "Password must contain atleast one lowercase, one special character, there should not be any space and length of password must be in range [8-15]" })
        return false;
    }
    return true;
}    

//         (?=.*[0-9]) atleast one digit 
//         (?=.*[a-z]) atleast one lowercase letter
//         (?=.*[!@#$%^&*]) atleast one special charactor
//          [a-zA-Z0-9!@#$%^&*]{8,15} length in b/w in 8 to 15 and any char belongs to [a-z0-9!@#$%^&*]

module.exports.validatePassword = validatePassword
module.exports.isValidObjectId = isValidObjectId
module.exports.isValidString = isValidString 
module.exports.validateSubCategory= validateSubCategory



