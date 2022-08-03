const express = require("express")
const router = express.Router()
const {authentication,authorization} = require("../middleware/auth");
const {userRegister,userLogin,getUserDetails,updateUserDetails}=require('../controllers/userController')
const{createProducts,getAllProduct,getProductsById,UpdateProducts,DeleteProducts}=require('../controllers/productController')
const {createCart,updateCart,getCartDeatils,DeleteCart}=require('../controllers/cartController')


//============= User Routes============================================================================================//
router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/user/:userId/profile',authentication,authorization,getUserDetails)
router.put('/user/:userId/profile',authentication,authorization,updateUserDetails)

//============= Products Routes============================================================================================//
router.post('/products',createProducts)
router.get('/products',getAllProduct)
router.get('/products/:productId',getProductsById)
router.put('/products/:productId',UpdateProducts)
router.delete('/products/:productId',DeleteProducts)

//===============Cart =======================//
router.post('/users/:userId',authentication,authorization,createCart)
router.put('/users/:userId/cart',authentication,authorization,updateCart)
router.get('/users/:userId/cart',authentication,authorization,getCartDeatils)
router.delete('/users/:userId/cart',authentication,authorization,DeleteCart)
module.exports= router