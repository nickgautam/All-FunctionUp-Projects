const express = require("express")
const router = express.Router()
const {auth} = require("../middleware/auth");
const {userRegister,userLogin,getUserDetails,updateUserDetails}=require('../controllers/userController')
const{createProducts,getAllProduct,getProductsById,UpdateProducts,DeleteProducts}=require('../controllers/productController')
const {createCart,updateCart,getCartDeatils,DeleteCart}=require('../controllers/cartController')
const {createOrder} =require('../controllers/orderController')

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

//===============Cart Routes =======================//
router.post('/users/:userId',createCart)
router.put('/users/:userId/cart',updateCart)
router.get('/users/:userId/cart',getCartDeatils)
router.delete('/users/:userId/cart',DeleteCart)

//============Order Routes ==========================//
router.post('/users/:userId/orders',createOrder)
module.exports= router