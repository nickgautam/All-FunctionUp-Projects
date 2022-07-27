const express = require("express")
const router = express.Router()
const {auth} = require("../middleware/auth");
const {userRegister,userLogin,getUserDetails,updateUserDetails}=require('../controllers/userController')


router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/user/:userId/profile', auth, getUserDetails)
router.put('/user/:userId/profile', auth, updateUserDetails)



module.exports= router