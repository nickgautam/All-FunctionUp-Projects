const userModel = require('../models/userModel')
const { isValid } = require('../validator/validator')
const awsController = require("../controllers/awsController")
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.userRegister = async (req, res) => {
    try {

        let data = req.body
        let files = req.files
        

        
        
        let { fname, lname, email, profileImage, phone, password, address, ...rest } = data
       
        
        if (files && files.length > 0) var uploadedFileURL = await awsController.uploadFile(files[0])
        data.profileImage = uploadedFileURL

        console.log(data)
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter some data in request body" })
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribute in request body" })
        if (!fname) return res.status(400).send({ status: false, message: "fname is required" })
        if (!lname) return res.status(400).send({ status: false, message: "lname is required" })
        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        if (!phone) return res.status(400).send({ status: false, message: "phone is required" })
        if (!password) return res.status(400).send({ status: false, message: "password is required" })
        if (!address) return res.status(400).send({ status: false, message: "address is required" })

        if (!isValid(fname)) return res.status(400).send({ status: false, message: "fname is invalid" })
        if (!isValid(lname)) return res.status(400).send({ status: false, message: "lname is invalid" })
        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is invalid" })
        if (!/^[6789]\d{9}$/.test(phone)) return res.status(400).send({ status: false, message: "phone is invalid" })
        // if (!/^[a-z0-9.]{2,}@+[a-z]{3,5}\.[a-z]{2,3}$/.test(email)) { return res.status(400).send({ status: false, message: `Email is not valid ${email}`}) }
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
 data=JSON.parse(data.address)
//data.address=userAdd
        data.password = bcrypt.hashSync(password, saltRounds)
        console.log(data.password)





        const creatUser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User Created Successfully", creatUser })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }



}