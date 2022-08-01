//const cartModel=('../models/cartModel')
const cartModel = require('../models/cartModel')
exports.createCart= async(req,res)=>{

 try {
        let userId=req.params.userId
        let data =req.body
        let{items,totalPrice, totalItems} =req.body
    
    const createCart=await cartModel.create(data)
    return res.status(201).send({status:true,message:"Cart Successfully created",createCart})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }

}