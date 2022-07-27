const productModel = require('../models/productModel')
const { isValid, parseJSONSafely } = require("../validator/validator")
const { uploadFile } = require("./awsController")

const validTitle = /^[a-zA-Z ]{3,20}$/
const validCurrencyId= /^[a-zA-Z ]{3,20}$/
const validPrice=/\d{1,}(?:[.,]\d{3})*(?:[.,]\d{2})?/

// const validEmail = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
// const validPhoneNumber = /^[0]?[6789]\d{9}$/
// const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*#?&]{8,15}$/;


exports.createProducts = async (req, res) => {
    try {
        let data = req.body
        let files = req.files

        let { title, description, price, currencyId, currencyFormat, productImage, style, availableSizes, installments, ...rest } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter some data in request body" })
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribute in request body" })
      
        if (!title) return res.status(400).send({ status: false, message: "title is required" })
        if (!description) return res.status(400).send({ status: false, message: "description is required" })
        if (!price) return res.status(400).send({ status: false, message: "price is required" })
        if (!currencyId) return res.status(400).send({ status: false, message: "currencyId is required" })
        if (!currencyFormat) return res.status(400).send({ status: false, message: "currencyFormat is required" })

        
        if (!validTitle.test(title)) return res.status(400).send({ status: false, message: " title is invalid " })
        if (!isValid(description)) return res.status(400).send({ status: false, message: " description  is invalid " })
        if (!isNaN(description)) return res.status(400).send({ status: false, message: "description can't be a number" })
        if (!isValid(price)) return res.status(400).send({ status: false, message: " price  is invalid " })
        if(validPrice.test(price)) res.status(400).send({ status: false, message: " price  is invalid " })

        if (!validCurrencyId.test(currencyId)) return res.status(400).send({ status: false, message: " currencyId is invalid " }) ////---->dought USD/INR
        if (!isValid(currencyFormat)) return res.status(400).send({ status: false, message: " currencyFormat  is invalid " })    ///----->currency format

        if (typeof style === "string" && style.trim().length === 0) return res.status(400).send({ status: false, message: " style is invalid " })
        if (installments) {
            if (isNaN(installments)) return res.status(400).send({ status: false, message: "installments should be a number" })
        }

        if (!files.length) return res.status(400).send({ status: false, message: "Please Provide the Image file" })
        mimetype = files[0].mimetype.split("/") //---["image",""]
        if (mimetype[0] !== "image") return res.status(400).send({ status: false, message: "Please Upload the Image File only" })
        if (files && files.length > 0) var uploadedFileURL = await uploadFile(files[0])
        data.productImage = uploadedFileURL


        if (["S", "XS", "M", "X", "L", "XXL", "XL"].indexOf(availableSizes) == -1) {
            return res.status(400).send({
                status: false,
                message: " Enter a valid availableSizes S, XS, M, X, L, XXL, XL "
            })
        }

        let checkTitle = await productModel.findOne({ title: title })
        if (checkTitle) return res.status(400).send({ status: false, message: "title already exists" })

        let product = await productModel.create(data);
        return res.status(201).send({ status: true, message: "Product created successfully", data: product })

    } catch (err) { return res.status(500).send({ status: false, message: err.message }) }


}



exports.getAllProduct = async (req, res) => {

    try {
        const filterData = { isDeleted: false }
        let data = req.query

        let { size, name, priceGreaterThan, priceLessThan } = data






        if (data.hasOwnProperty("name")) {
            if (!isValid(name)) { return res.status(400).send({ status: false, message: "Plsease provide name" }) }
        }


        if (data.hasOwnProperty("size")) {
            if (!isValid(size)) { return res.status(400).send({ status: false, message: "Plsease provide size" }) }
        }
        if (data.hasOwnProperty("priceGreaterThan")) {
            if (!isValid(priceGreaterThan)) { return res.status(400).send({ status: false, message: "price should be greaterthan" }) }
        }
        if (data.hasOwnProperty("priceLessThan")) {
            if (!isValid(priceLessThan)) { return res.status(400).send({ status: false, message: "price should be lessthan" }) }
        }





        // if (priceGreaterThan) {
        //     (!isNaN(priceGreaterThan)) 
        //     return res.status(400).send({status:false,message:"Price should be a number"})
        // }
        // if (priceLessThan) {
        //     (isNaN(priceLessThan))  
        //     return res.status(400).send({status:false,message:"Price should be a number"}) 

        // }



        const productDetail = await productModel.find({ data, isDeleted: false })
        if (productDetail.length > 0) {
            return res.status(200).send({ status: true, data: productDetail })
        } else {
            return res.status(404).send({ status: false, message: "Product not found" })
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

