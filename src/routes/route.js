const express = require("express")
const router = express.Router()
const {auth} = require("../middleware/auth");
const {userRegister,userLogin,getUserDetails,updateUserDetails}=require('../controllers/userController')
const{createProducts,getAllProduct,getProductsById,UpdateProducts,DeleteProducts}=require('../controllers/productController')
const {createCart,getCartDeatils}=require('../controllers/cartController')


//============= User Routes============================================================================================//
router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/user/:userId/profile',auth,getUserDetails)
router.put('/user/:userId/profile',auth,updateUserDetails)
//============= Products Routes============================================================================================//
router.post('/products',createProducts)
router.get('/products',getAllProduct)
router.get('/products/:productId',getProductsById)
router.put('/products/:productId',UpdateProducts)
router.delete('/products/:productId',DeleteProducts)


//===============Cart =======================//

router.post('/users/:userId',createCart)
router.get('/users/:userId/cart',auth,getCartDeatils)

module.exports= router