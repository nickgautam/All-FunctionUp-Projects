const  mongoose = require('mongoose')
const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')



exports.createCart= async(req,res)=>{

 try {
        let userId=req.params.userId
        let data =req.body
        let{cartId, productId,quantity} =req.body
      data.userId=userId



      const cartData = {
        userId: userId,
        items: [{
            productId: productId,
            quantity: quantity,
        }],
        // totalPrice: 
        // totalItems: 
    }
    let createCart=await cartModel.create(cartData)
    return res.status(201).send({status:true,message:"Cart Successfully created",createCart})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }

}





exports.getCartDeatils=async(req,res)=>{

try {
    
    let userId=req.params.userId
    if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({status:false,message:"Invalid user Id"})
    let checkUserId = await userModel.findById(userId)
    if(!checkUserId) return res.status(404).send({status:false,message:"User not found"})
    let checkCart = await cartModel.findOne({userId:userId})
    //console.log(checkCart)
    if(!checkCart) return res.status(404).send({status:false,message:"cart not found"})
    return res.status(200).send({status:true, message:"Cart details found successfully",checkCart})
}  catch (error) {
    return res.status(500).send({status:false, message:error.message})
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