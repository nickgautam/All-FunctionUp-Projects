const express = require("express")
const router = express.Router()
const {auth} = require("../middleware/auth");
const {userRegister,getUserDetails}=require('../controllers/userController')




router.get("/text", function(req, res){
    res.send({message: "hello"})
})

router.post('/register',userRegister)

router.get('/user/:userId/profile',auth,getUserDetails)




module.exports= router