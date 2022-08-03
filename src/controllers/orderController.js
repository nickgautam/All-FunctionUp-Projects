const productModel = require('../models/productModel')



exports.createOrder = (req,res)=>{
    try {
        let userId =req.params.userId
        




    } catch (error) {
         return res.status(500).send({ status: false, message: error.message })
    }




}


