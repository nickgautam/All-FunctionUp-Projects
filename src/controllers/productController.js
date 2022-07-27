
const productModel = require('../models/productModel')
const { isValid } = require('../validator/validator')
const mongoose = require('mongoose')


exports.createProducts = (req, res) => {




}



exports.getAllProduct = async (req, res) => {

    try {
        const filterData = { isDeleted: false }
        let data = req.query

        let { size, name, priceGreaterThan, priceLessThen } = data

        if (name) {
            if (!isValid(name)) { return res.status(400).send({ status: false, message: "Plsease provide name" }) }
        }

        if (size) {
            if (!isValid(size)) { return res.status(400).send({ status: false, message: "Plsease provide size" }) }
        }
        if (priceGreaterThan) {
            if (!isValid(priceGreaterThan)) { return res.status(400).send({ status: false, message: " price should be greter then" }) }
        }
        if (priceLessThen) {
            if (!isValid(priceLessThen)) { return res.status(400).send({ status: false, message: "price should be less then" }) }
        }





        if (priceGreaterThan) {
            (isNaN(priceGreaterThan)) 
            return res.status(400).send({status:false,message:"Price should be a number"})
        }
        if (priceLessThen) {
            (isNaN(priceLessThen))  
            return res.status(400).send({status:false,message:"Price should be a number"}) 

        }

       

        const productDetail = await productModel.find({ data, isDeleted: false })
        if(productDetail.length>0){
            return res.status(200).send({ status: true, data: productDetail })
        }else{
            return res.status(404).send({ status: false, message:"Product not found" })
        }

       


    } catch (error) {
        return res.status(500).send({ status: true, message: error.message })
    }



}



exports.getProductsById = async (req, res) => {


    try {
        const productId = req.params.userId

        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Product id not valid" })

        const productDetail = await productModel.findById({ productId, isDeleted: false })
        if (!productDetail) return res.status(404).send({ status: false, message: "product not found" })
        return res.status(200).send({ status: true, message: "Product found successfully", data: productDetail })

    } catch (error) {
        return res.status(500).send({ status: true, message: error.message })
    }


}



exports.UpdateProducts = (req, res) => {



}





exports.DeleteProducts = async (req, res) => {
    try {

        const productId = req.params.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Product id not valid" })

        const productDetail = await productModel.findById({ productId, isDeleted: false })
        if (!productDetail) return res.status(404).send({ status: false, message: "product not found" })

        const checkDelatedproduct = await productModel.findOne({ _id: productId, isDeleted: true })
        if (checkDelatedproduct) return res.status(404).send({ status: false, message: "Product already deleted" })

        const DeleteProduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true, deletedAt: Date() })
        return request.status(200).send({ status: true, message: "Product Deleted Succesfully" })

    } catch (error) {
        return res.status(500).send({ status: true, message: error.message })
    }



}

