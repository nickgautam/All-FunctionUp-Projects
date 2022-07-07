const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken');

function isNum(val) {
    return !isNaN(val)
}
const isValidString = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value !== "string" || value.trim().length === 0) return false //"   "
    return true;
}

//                        (?=.*[0-9]) atleast one digit 
//                        (?=.*[A-Z]) atleast one uppercase letter
//                        (?=.*[a-z]) atleast one lowercase letter
//                        (?=.*[!@#$%^&*]) atleast one special charactor
//                         [a-zA-Z0-9!@#$%^&*]{4,16} length in b/w in 4 to 16 and any char belongs to [a-zA-Z0-9!@#$%^&*]
const validatePassword = (password, res) => {
    let regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,16}$/
    if (!regex.test(password)) {
        res.status(400).send({ status: false, msg: "Password contain one lowercase, one special character, there should not be any space and length of password must be in range [4-16]" })
        return false;
    }
    return true;
}                       

let regexName =    /^[A-Za-z. -]+$/   
let regexPhone = /^[6789]\d{9}$/
let regexPincode = /^\d{6}$/
let regexEmail = /^[a-z0-9.]{2,}@+[a-z]{3,5}\.[a-z]{2,3}$/ //"nk@gmail.com"

const createUser = async function (req, res) {

    try {
        let data = req.body
        let { title, name, phone, email, password, address } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Request body can't be empty"
            })
        }

        if (!title) {
            return res.status(400).send({
                status: false,
                message: "title is mandatory"
            })
        }

        if (["Mr", "Mrs", "Miss"].indexOf(title) == -1) {
            return res.status(400).send({
                status: false,
                message: "Enter a valid title Mr or Mrs or Miss ",
            })
        }

        if (!name) {
            return res.status(400).send({
                status: false,
                message: "name is mandatory"
            })
        }

        if (!regexName.test(name)) {
            return res.status(400).send({
                status: false,
                message: "name is invalid"
            })
        }

        if (!isValidString(name)) {
            return res.status(400).send({
                status: false,
                message: "name should be a string, doesn't have whitespace"
            })
        }

        if (!phone) return res.status(400).send({ status: false, message: "phone is mandatory" })

        if (!regexPhone.test(phone)) return res.status(400).send({ status: false, message: "phone is invalid" })

        let checkPhone = await userModel.findOne({ phone: phone })

        if (checkPhone) {
            return res.status(400).send({
                status: false,
                message: "phone is already registered"
            })
        }

        if (!email) {
            return res.status(400).send({
                status: false,
                message: "email is mandatory"
            })
        }

        if (!regexEmail.test(email)) { return res.status(400).send({ status: false, message: "email should look like this anything@anything.com, and should not any space" }) }

        if (!isValidString(email)) return res.status(400).send({ status: false, message: "email should be a string, shouldn't have whitespace" })
          
        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) {
            return res.status(400).send({
                status: false,
                message: "email is already registered"
            })
        }

        if (!password) {
            return res.status(400).send({
                status: false,
                message: "password is mandatory"
            })
        }

        if (password !== undefined)
            if (!validatePassword(password, res)) return;

        if (address) {
            if (Object.keys(address).length == 0) return res.status(400).send({ status: false, message: "address can't be empty" })

            if (!isValidString(address.street)) {
                return res.status(400).send({
                    status: false,
                    message: "street should be a string, shouldn't have whitespace"
                })
            }

            if (!isValidString(address.city)) {
                return res.status(400).send({
                    status: false,
                    message: "city should be a string, shouldn't have whitespace"
                })
            }

           if (!isValidString(address.pincode)) return res.status(400).send({ status: false, message: "pincode should be a number, inside quotes, and shouldn't have whitespace" })

            if (isNum(address.city) == true) {
                return res.status(400).send({
                    status: false,
                    message: "city can't be a number"
                })
            }

            if (!regexPincode.test(address.pincode)) {
                return res.status(400).send({
                    status: false,
                    message: "pincode is invalid"
                })
            }

        }

        let saveData = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: saveData })

    } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}


const userLogin = async function (req, res) {

    const loginData = req.body
    const { email, password } = loginData

    try {
        if (Object.keys(loginData).length == 0) {
            res.status(400).send({ status: false, message: "login credentials must be presents & only email and password should be inside body" })
            return
        }
        if (!email) {
            return res.status(400).send({ 
                status: false, 
                message: "email must be present " 
            })
        }
        if (!password) {
            return res.status(400).send({ 
                status: false, 
                message: "password must be present " 
            })
        }
        const user = await userModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(400).send({ status: false, message: "Make sure your login Credentials are correct or not " })
            
        }
        const token = await jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        }, "my@third@project@book@management")

        res.header('x-api-key', token)
        res.status(200).send({ status: true, message: 'user login successfull', token: token })

    } catch (error) {
        return res.status(500).send({ 
            status: false, 
            message: error.message 
        })
    }
}



module.exports.userLogin = userLogin
module.exports.createUser = createUser
