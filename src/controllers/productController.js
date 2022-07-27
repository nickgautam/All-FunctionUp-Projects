
const productModel = require('../models/productModel')
//const ProductModel = require('../models/productModel')

exports.createProducts =(req,res)=>{



}



exports.getProducts = async (req,res)=>{



    try {
        let data = req.query

  let {size,productName,priceGreaterThen,priceLessThen}=data
  

  const productDetail = await productModel.find({data})
  return res.status(200).send({status:true,data:productDetail})


    } catch (error) {
        return res.status(500).send({status:true,message:error.message})
    }
  


}



exports.getProductsById =(req,res)=>{



}



exports.UpdateProducts =(req,res)=>{



}





exports.DeleteProducts =(req,res)=>{



}

