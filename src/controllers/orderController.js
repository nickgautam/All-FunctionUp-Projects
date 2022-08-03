const orderModel = require('../models/productModel')



exports.createOrder = async (req,res)=>{
    try {
        let userId =req.params.userId
        let data=req.body
        const OrderCreate = await orderModel.create(data)
        return res.status(200).send({status:true , message:"Order Created Successfully"})











    } catch (error) {
         return res.status(500).send({ status: false, message: error.message })
    }




}


