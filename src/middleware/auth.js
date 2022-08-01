const jwt = require('jsonwebtoken')
const mongoose = require("mongoose")
const userModel = require('../models/userModel')

exports.auth = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        console.log(token)
        if (!token) return res.status(400).send({ status: false, message: "Token is missing" });
        token = token.split(" ")
        console.log(token)
        let decodedToken = jwt.verify(token[1], "my@fifth@project@product@management", function (err, data) {
            if (err) return null
            else {return data}
        });
        if(!decodedToken) return res.status(401).send({ status: false, message: "Token is invalid" });
        // console.log(decodedToken)
     let userId = req.params.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "userId is not valid" })
        let checkUserId = await userModel.findById(userId)
        if (!checkUserId) return res.status(404).send({ status: false, message: "User not found" })
        if(req.params.userId !== decodedToken.userId) return res.status(403).send({ status: false, message: "User logged is not authorized to access & manipulate other's data" });
        next();
    } catch (error) { 
        return res.status(500).send({ status: false, message: error.message })
    }



}
