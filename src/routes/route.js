const express = require("express")
const router = express.Router()
// const {auth} = require("../middleware/auth");
const {userRegister,userLogin,getUserDetails}=require('../controllers/userController')




router.get("/text", function(req, res){
    res.send({message: "hello"})
})

router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/user/:userId/profile',getUserDetails)




module.exports= router