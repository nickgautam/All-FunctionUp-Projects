const userModel = require('../model/userModel')
const validator = require('../validation/validation')
const jwt = require("jsonwebtoken");
const _ = require("lodash")
//***************************************** createUser **********************************************************/

const createUser = async function (req, res) {

    try {
        let data = req.body
        let { title, name, phone, email, password, address } = data

        if (Object.keys(data).length == 0) {     // [ ] ===> { }
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

        if (!/^[A-Za-z. -]+$/.test(name)) {
            return res.status(400).send({
                status: false,
                message: "name is invalid"
            })
        }

        if (!validator.isValidString(name)) {
            return res.status(400).send({
                status: false,
                message: "name should be a string, doesn't have whitespace"
            })
        }

        if (!phone) return res.status(400).send({ status: false, message: "phone is mandatory" })

        if (!/^[6789]\d{9}$/.test(phone)) return res.status(400).send({ status: false, message: "phone is invalid" })

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

        if (!/^[a-z0-9.]{2,}@+[a-z]{3,5}\.[a-z]{2,3}$/.test(email)) { return res.status(400).send({ status: false, message: "email should look like this anything@anything.com, and should not any space" }) }

        if (!validator.isValidString(email)) return res.status(400).send({ status: false, message: "email should be a string, shouldn't have whitespace" })

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

        if (!validator.validatePassword(password, res)) return;

       
        if (address) {

            if(!_.isObject(address)) {
                return res.status(400).send({
                    status: false,
                    message: "address should be an object"
                })
            }

            if (Object.keys(address).length == 0) return res.status(400).send({ status: false, message: "address can't be empty" })

            if (!validator.isValidString(address.street)) {
                return res.status(400).send({
                    status: false,
                    message: "street should be a string, shouldn't have whitespace"
                })
            }

            if (!validator.isValidString(address.city)) {
                return res.status(400).send({
                    status: false,
                    message: "city should be a string, shouldn't have whitespace"
                })
            }

            if (!isNaN(address.city)) {
                return res.status(400).send({
                    status: false,
                    message: "city can't be a number"
                })
            }

            if (!validator.isValidString(address.pincode)) {
                return res.status(400).send({
                    status: false,
                    message: "pincode should be a number, inside quotes, and shouldn't have whitespace"
                })
            }

            if (!/^\d{6}$/.test(address.pincode)) {
                return res.status(400).send({
                    status: false,
                    message: "pincode is invalid"
                })
            }
        }

        let saveData = await userModel.create(data)
        return res.status(201).send({ 
            status: true, 
            message: 'User Successfully Created', 
            data: saveData 
        })

    } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}


//***************************************** LoginUser **********************************************************/

const userLogin = async function (req, res) {

    try {

        const loginData = req.body
        const { email, password } = loginData

        if (Object.keys(loginData).length == 0) {
            return res.status(400).send({ 
                status: false, 
                message: "login credentials must be presents & only email and password should be inside body" 
            })
            
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
            return res.status(401).send({ status: false, message: "Make sure your login Credentials are correct or not " })

        }

        const token = await jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 23 * 60 * 60
        }, "my@third@project@book@management")

        res.setHeader('x-api-key', token)
        res.status(201).send({ status: true, message: 'user login successfully', data: token })

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}


module.exports.userLogin = userLogin
module.exports.createUser = createUser