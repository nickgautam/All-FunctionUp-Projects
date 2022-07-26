const express = require("express")
const router = express.Router()
const {auth} = require("../middleware/auth");
const {userRegister,userLogin,getUserDetails}=require('../controllers/userController')


router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/user/:userId/profile',auth, getUserDetails)
router.put('/user/:userId/profile',)



module.exports= router