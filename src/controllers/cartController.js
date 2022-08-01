const  mongoose = require('mongoose')
const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')



exports.createCart= async(req,res)=>{

 try {
        let userId=req.params.userId
        let data =req.body
        let{items,totalPrice, totalItems} =req.body
      data.userId=userId
    let createCart=await cartModel.create(data)
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



exports.DeleteCart =(req,res)=>{



    
}