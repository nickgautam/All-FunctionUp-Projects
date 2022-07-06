const userModel = require('../model/userModel')
function isNum(val) {
    return !isNaN(val)
}
const isValidString = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true;
}

let regexName = /^[A-Za-z -]+$/

const createUser = async function (req, res) {

    try {
        let data = req.body
        let { title, name, phone, email, password, address } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Request body can't be empty" })

        if (!title) return res.status(400).send({ status: false, message: "title is mandatory" })

        if (["Mr", "Mrs", "Miss"].indexOf(title) == -1)
            return res.status(400).send({ status: false, data: "Enter a valid title Mr or Mrs or Miss ", })

        if (!name) return res.status(400).send({ status: false, message: "name is mandatory" })

        if (!regexName.test(name)) return res.status(400).send({ status: false, message: "name is invalid" })

        if (!isValidString(name)) return res.status(400).send({ status: false, message: "name should be a string, doesn't have whitespace" })

        if (isNum(name) == true) return res.status(400).send({ status: false, message: "name can't be a number" })

        if (!phone) return res.status(400).send({ status: false, message: "phone is mandatory" })

        if (!isValidString(phone)) return res.status(400).send({ status: false, message: "phone should be a number and inside the quotes, shouldn't have whitespace" })

        if ((phone).length != 10) return res.status(400).send({ status: false, message: "phone must be a 10 digits" })

        if ((phone).charAt(0) == 0) return res.status(400).send({ status: false, message: "phone should not start with 0" })

        if (isNum(phone) == false) return res.status(400).send({ status: false, message: "phone should be a number" })


        let checkPhone = await userModel.findOne({ "phone": phone })

        if (checkPhone) return res.status(400).send({ status: false, message: "phone is already registered" })

        if (!email) return res.status(400).send({ status: false, message: "email is mandatory" })

        if (!isValidString(email)) return res.status(400).send({ status: false, message: "email should be a string, shouldn't have whitespace" })
        //if(typeof(email)!=="string" || email.trim().length==0) return res.status(400).send({status: false, message:"email should be a string & can't be empty"})

        if (isNum(email) == true) return res.status(400).send({ status: false, message: "email can't be a number" })
        //nishant@gmail.com
        let regex = /^[a-z0-9]{2,}@+[a-z]{3,5}\.[a-z]{2,3}$/
        if (!regex.test((email))) { return res.status(400).send({ status: false, message: "email should look like this anything@anything.com, and should not any space" }) }

        let checkEmail = await userModel.findOne({ "email": email })
        if (checkEmail) return res.status(400).send({ status: false, message: "email is already registered" })

        if (!password) return res.status(400).send({ status: false, message: "password is mandatory" })

        if (!address) return res.status(400).send({ status: false, message: "address is mandatory" })

        if (Object.keys(address).length == 0) return res.status(400).send({ status: false, message: "address is mandatory, can't be empty" })

        if (!address.city) return res.status(400).send({ status: false, message: "city is mandatory" })

        if (!address.street) return res.status(400).send({ status: false, message: "street is mandatory" })

        if (!address.pincode) return res.status(400).send({ status: false, message: "pincode is mandatory" })

        if (!isValidString(address.street)) return res.status(400).send({ status: false, message: "street should be a string, shouldn't have whitespace" })

        if (!isValidString(address.city)) return res.status(400).send({ status: false, message: "city should be a string, shouldn't have whitespace" })

        if (!isValidString(address.pincode)) return res.status(400).send({ status: false, message: "pincode should be a string, shouldn't have whitespace" })

        if (isNum(address.city) == true) return res.status(400).send({ status: false, message: "city can't be a number" })

        if ((address.pincode).length != 6) return res.status(400).send({ status: false, message: "pincode must have 6 digits" })

        if (isNum(address.pincode) == false) return res.status(400).send({ status: false, message: "pincode should be a number" })

        let saveData = await userModel.create(data)
        res.status(201).send({ status: true, message: 'Success', data: saveData })

    }catch(err){return res.status(500).send({status: false, message: err.message})}
}
module.exports.createUser = createUser