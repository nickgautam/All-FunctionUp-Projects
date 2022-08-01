const mongoose = require('mongoose')
const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')
const productModel = require('../models/productModel')


exports.createCart = async (req, res) => {

    try {
        let userId = req.params.userId
        let data = req.body
        let totalPrice = 0;
        let totalItems

        let checkCart = await cartModel.findOne({ userId: userId })
        if (!checkCart) {
            data.userId = userId
            let { items } = data
            for (products of items) {
                let { productId, quantity } = products
                console.log(products)
                if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "productId is not valid" })
               if(quantity<=0) return res.status(400).send({ status: false, message: "quantity should be in between 0-20" })
                let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
                if (!findProduct) return res.status(404).send({ status: false, message: "Product not found" })
                totalPrice = totalPrice + (findProduct.price * quantity)
            }
            data.totalItems= items.length
            data.totalPrice= totalPrice

            let createCart=await cartModel.create(data)
            return res.status(201).send({status:true,message:"Cart Successfully created", data:createCart})
        }
        if(data.cartId){
            let findCart = await cartModel.findById(data.cartId)
            if (!mongoose.Types.ObjectId.isValid(data.cartId)) return res.status(400).send({ status: false, message: "productId is not valid" })
            if(!findCart) return res.status(404).send({ status: false, message: "cart not found" })
        let { items } = data
        for (products of items) {
            let { productId, quantity } = products
            if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "productId is not valid" })
            if(quantity<=0) return res.status(400).send({ status: false, message: "quantity should be in between 0-20" })
            let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!findProduct) return res.status(404).send({ status: false, message: "Product not found" })    
            let z= checkCart.items.find(obj=>obj.productId===productId)
            if(z){
                z.quantity= quantity+z.quantity
                checkCart.items= z.quantity
        
                 }
        }
    }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}





exports.getCartDeatils = async (req, res) => {

    try {

        let userId = req.params.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Invalid user Id" })
        let checkUserId = await userModel.findById(userId)
        if (!checkUserId) return res.status(404).send({ status: false, message: "User not found" })
        let checkCart = await cartModel.findOne({ userId: userId })
        //console.log(checkCart)
        if (!checkCart) return res.status(404).send({ status: false, message: "cart not found" })
        return res.status(200).send({ status: true, message: "Cart details found successfully", checkCart })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }




}



exports.DeleteCart =async(req,res)=>{



    let userId= req.params.userId
    if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({status:false,message:"Invalid user Id"})

    let checkCart = await cartModel.findOne({userId:userId})
    //console.log(checkCart)
    if(!checkCart) return res.status(404).send({status:false,message:"cart not found"})

       

        let deletedCart =await cartModel.findOneAndUpdate({ _id: userId }, {$set: {items:[], totalPrice:0,totalItems:0}} , { new: true })
      //  if (deletedCart) return res.status(400).send({ status: false, message: "cart already deleted" })
        return res.status(204).send({ status: true, message: "cart Deleted Succesfully"})  //204 = No content found//
       

}