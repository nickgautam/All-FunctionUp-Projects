const userModel = require('../models/userModel')
const { isValid } = require('../validator/validator')
const awsController = require("../controllers/awsController")
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const saltRounds = 10;

exports.userRegister = async (req, res) => {
    try {

        let data = req.body
        let files = req.files


        data = JSON.parse(JSON.stringify(data));
        data.address = JSON.parse(data.address)
        data.phone = parseInt(data.phone)

        let { fname, lname, email, profileImage, phone, password, address, ...rest } = data


        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter some data in request body" })
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribute in request body" })
        if (!fname) return res.status(400).send({ status: false, message: "fname is required" })
        if (!lname) return res.status(400).send({ status: false, message: "lname is required" })
        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        if (!isValid(phone)) return res.status(400).send({ status: false, message: "phone is required" })
        if (!password) return res.status(400).send({ status: false, message: "password is required" })
        if (!address) return res.status(400).send({ status: false, message: "address is required" })

        if (!isValid(fname)) return res.status(400).send({ status: false, message: "fname is invalid" })
        if (!validName.test(name)) return res.status(400).send({ status: false, message: "name is Invalid" })

        if (!isValid(lname)) return res.status(400).send({ status: false, message: "lname is invalid" })
        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is invalid" })
        if (!/^[6789]\d{9}$/.test(phone)) return res.status(400).send({ status: false, message: "phone is invalid" })
        if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) { return res.status(400).send({ status: false, message: `Email is not valid ${email}` }) }
        if (!isValid(password)) return res.status(400).send({ status: false, message: "password is invalid" })

        if (typeof address !== "object") return res.status(400).send({ status: false, message: "address is invalid type" })
        let { shipping, billing } = address
        if (typeof billing !== "object") return res.status(400).send({ status: false, message: "billing is invalid type" })
        if (typeof shipping !== "object") return res.status(400).send({ status: false, message: "shipping is invalid type" })
        if (!isValid(shipping.street)) return res.status(400).send({ status: false, message: " shipping street is invalid " })
        if (!isValid(shipping.city)) return res.status(400).send({ status: false, message: " shipping city is invalid" })
        if (!/^\d{6}$/.test(shipping.pincode)) return res.status(400).send({ status: false, message: " shipping pincode is invalid" })
        if (!/^\d{6}$/.test(billing.pincode)) return res.status(400).send({ status: false, message: " billing pincode is invalid" })
        if (!isValid(billing.street)) return res.status(400).send({ status: false, message: " billing street is invalid " })
        if (!isValid(billing.city)) return res.status(400).send({ status: false, message: "billing city is invalid" })

        let findEmail = await userModel.findOne({ email: email })
        if (findEmail) return res.status(400).send({ status: false, message: "Email already exist" })

        let findPhone = await userModel.findOne({ phone: phone })
        if (findPhone) return res.status(400).send({ status: false, message: "Phone Number already exist" })

        data.password = bcrypt.hashSync(password, saltRounds)
        if (files && files.length > 0) var uploadedFileURL = await awsController.uploadFile(files[0])
        data.profileImage = uploadedFileURL

        const creatUser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User Created Successfully", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }



}


exports.getUserDetails = async (req, res) => {
    const userId = req.params.userId

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "User id not valid" })
        const checkUserId = await userModel.findById(userId)
        if (!checkUserId) return res.status(404).send({ status: false, message: "User not found" })

        return res.status(200).send({ status: true, message: "User profile details", data: checkUserId })
    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })

    }

}