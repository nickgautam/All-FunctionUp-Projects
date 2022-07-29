const express = require("express")
const router = express.Router()
const {auth} = require("../middleware/auth");
const {userRegister,userLogin,getUserDetails,updateUserDetails}=require('../controllers/userController')
const{createProducts,getAllProduct,getProductsById,UpdateProducts,DeleteProducts}=require('../controllers/productController')

router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/user/:userId/profile',auth,getUserDetails)
router.put('/user/:userId/profile',updateUserDetails)
//============= Products Routes============================================================================================//
router.post('/products',createProducts)
router.get('/products',getAllProduct)
router.get('/products/:productId',getProductsById)
router.put('/products/:productId',UpdateProducts)
router.delete('/products/:productId',DeleteProducts)

module.exports= router