const express = require("express")
const router = express.Router()
const {userRegister}=require('../controllers/userController')




router.get("/text", function(req, res){
    res.send({message: "hello"})
})

router.post('/register',userRegister)






module.exports= router