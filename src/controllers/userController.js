const userModel = require('../models/userModel')
const { isValid } = require('../validator/validator')
const awsController = require("../controllers/awsController")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt =require("jsonwebtoken")

exports.userRegister = async (req, res) => {
    try {

        let data = req.body
        let files = req.files


        data = JSON.parse(JSON.stringify(data));
        data.address = JSON.parse(data.address)
        data.phone=parseInt(data.phone)

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
        return res.status(201).send({ status: true, message: "User Created Successfully", data: creatUser })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }



}


 exports.userLogin = async function(req,res){
    try{
        let credentials= req.body
        if(Object.keys(credentials).length==0) return res.status(400).send({status:false, message:"Please enter email & password"})
      let {email, password}= credentials
      if (!email) return res.status(400).send({ status: false, message: "email is required" })
      if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) { return res.status(400).send({ status: false, message: `Email is not valid ${email}` }) }
      if (!password) return res.status(400).send({ status: false, message: "email is required" })
      if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*])[a-z0-9!@#$%^&*]{8,15}$/.test(password)) { return res.status(400).send({ status: false, message: `password is not valid ${password}` }) }
      
      
      let user = await userModel.findOne({email:email})
       if(!checkCredential) return res.status(404).send({status:false, message:"User not found"})
       bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
          console.log("It matches!")
          const token = jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 23 * 60 * 60
        }, "my@fifth@project@product@management")
       
        let final={userId: JSON.stringify(user._id),token: token }

        res.status(200).send({ status: true, message: 'user login successfully', data: final})
        }
        else {
          console.log("Invalid password!");
        }
      });
       
        

    }catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
 }