const productModel = require('../models/productModel')
const { isValid, validString } = require("../validator/validator")
const { uploadFile } = require("./awsController")
const mongoose = require('mongoose')
const validObjectId = mongoose.Types.ObjectId

const validTitle = /^[a-zA-Z0-9 ]{3,20}$/
const validPrice = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/  ///------- we need to update the regex decimal 2 digits



exports.createProducts = async (req, res) => {
    try {
        let data = req.body
        let files = req.files
        data = JSON.parse(JSON.stringify(data));

        let { title, description, price, currencyId, currencyFormat, productImage, style, availableSizes, installments, ...rest } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter some data in request body" })
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribute in request body" })

        if (!title) return res.status(400).send({ status: false, message: "title is required" })
        if (!description) return res.status(400).send({ status: false, message: "description is required" })
        if (!price) return res.status(400).send({ status: false, message: "price is required" })
        if (!currencyId) return res.status(400).send({ status: false, message: "currencyId is required" })
        if (!currencyFormat) return res.status(400).send({ status: false, message: "currencyFormat is required" })


        if (!validTitle.test(title)) return res.status(400).send({ status: false, message: " title is invalid " })
        if (!isValid(description.trim())) return res.status(400).send({ status: false, message: " description  is invalid " })
        if (!isNaN(description.trim())) return res.status(400).send({ status: false, message: "description can't be a number" })
        if (!validPrice.test(price.trim())) return res.status(400).send({ status: false, message: "price is invalid " })
        if (currencyId.trim() !== "INR") return res.status(400).send({ status: false, message: "currencyId is invalid " })
        if (currencyFormat.trim() !== "₹") return res.status(400).send({ status: false, message: "currencyFormat is invalid " })
        if (!validString(style)) return res.status(400).send({ status: false, message: "Style is invalid" })
        if (installments) {
            if (isNaN(installments)) return res.status(400).send({ status: false, message: "installments should be a number" })
        }


        if (data.hasOwnProperty("availableSizes")) {
            availableSizes = availableSizes.toUpperCase().split(",");
            data.availableSizes = availableSizes
            for (i of availableSizes) {
                if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(i)) {
                    return res.status(400).send({
                        status: false,
                        message: " Enter a valid availableSizes S, XS, M, X, L, XXL, XL "
                    })
                }
            }
        }

        if (!files.length) return res.status(400).send({ status: false, message: "Please Provide the Image of the Product" })
        mimetype = files[0].mimetype.split("/") //---["image",""]
        if (mimetype[0] !== "image") return res.status(400).send({ status: false, message: "Please Upload the Image File only" })
        if (files && files.length > 0) var uploadedFileURL = await uploadFile(files[0])
        data.productImage = uploadedFileURL


        let checkTitle = await productModel.findOne({ title: title })
        if (checkTitle) return res.status(400).send({ status: false, message: "title already exists" })

        let product = await productModel.create(data);
        return res.status(201).send({ status: true, message: "Product created successfully", data: product })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

exports.getAllProduct = async (req, res) => {
    try {
        const filterData = { isDeleted: false }
        let data = req.query
        let { size, name, priceGreaterThan, priceLessThan } = data


        if (data.hasOwnProperty("size")) {
            if (!isValid(size)) { return res.status(400).send({ status: false, message: "Please provide size" }) }
            filterData.availableSizes = { $in: size.toUpperCase().split(",") }
        }
        if (data.hasOwnProperty("name")) {
            if (!validString(name)) { return res.status(400).send({ status: false, message: 'Please provide name ' }) }
            filterData.title = { $regex: `${name.toLowerCase()}` }
        }
        if (data.hasOwnProperty("priceGreaterThan")) {
            if (isNaN(priceGreaterThan)) return res.status(400).send({ status: false, message: "priceGreaterThan must be a number " })
            filterData.price = { $gt: priceGreaterThan }
        }
        if (data.hasOwnProperty("priceLessThan")) {
            if (isNaN(priceLessThan)) return res.status(400).send({ status: false, message: "priceLessThan must be a number" })
            filterData.price = { $lt: priceLessThan }
        }
        if (data.hasOwnProperty("priceGreaterThan") && data.hasOwnProperty("priceLessThan")) {
            filterData.price = { $gt: priceGreaterThan, $lt: priceLessThan }
        }

        const productDetail = await productModel.find(filterData).sort({ price: 1 })
        if (!productDetail.length) return res.status(404).send({ status: false, message: "Product not found" });
        return res.status(200).send({ status: true, data: productDetail })

    } catch (error) {
        return res.status(500).send({ status: true, message: error.message })
    }



}

exports.getProductsById = async (req, res) => {
    try {
        const productId = req.params.productId

        if (!validObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "Product id not valid" })
        const productDetail = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!productDetail) return res.status(404).send({ status: false, message: "product not found" })
        return res.status(200).send({ status: true, message: "Product found successfully", data: productDetail })

    } catch (error) {
        return res.status(500).send({ status: true, message: error.message })
    }
}

exports.UpdateProducts = async (req, res) => {
    try {

        let data = req.body
        let files = req.files
        let productId = req.params.productId


        data = JSON.parse(JSON.stringify(data));
        console.log(data, files)

        if (!validObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "Product id not valid" })
        let { title, description, price, currencyId, currencyFormat, productImage, style, availableSizes, installments, ...rest } = data

        if (Object.keys(data).length == 0 && (!files)) return res.status(400).send({ status: false, message: "Please enter some data to update" })
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribute in request body" })

        let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!findProduct) return res.status(404).send({ status: false, message: "Product not found" })

        if (data.hasOwnProperty("title")) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "  please insert the title " })
            if (!validTitle.test(title)) return res.status(400).send({ status: false, message: 'Title is Invalid' })
            const duplicateTitle = await productModel.findOne({ title: title })
            if (duplicateTitle) return res.status(400).send({ status: false, message: 'Title already exists ' })
            findProduct.title = title
        }
        if (data.hasOwnProperty("description")) {
            if (!isValid(description)) return res.status(400).send({ status: false, message: "  please insert the description " })
            if (!isNaN(description.trim())) return res.status(400).send({ status: false, message: "description can't be a number" })
            findProduct.description = description
        }
        if (data.hasOwnProperty("price")) {
            if (!isValid(price)) return res.status(400).send({ status: false, message: " please insert the price" })
            if (!validPrice.test(price.trim())) return res.status(400).send({ status: false, message: "price is invalid " })
            findProduct.price = price
        }
        if (data.hasOwnProperty("currencyId")) { //we have to ask about updation in INR
            if (currencyId.trim() !== "INR") return res.status(400).send({ status: false, message: "currencyId is invalid " })
            findProduct.currencyId = currencyId
        }
        if (data.hasOwnProperty("currencyFormat")) { //we have to ask about updation in currency format
            if (currencyFormat.trim() !== "₹") return res.status(400).send({ status: false, message: "currencyFormat is invalid " })
            findProduct.currencyFormat = currencyFormat
        }
        if (data.hasOwnProperty("style")) {
            if (!isValid(style)) return res.status(400).send({ status: false, message: "Style is invalid" })
            findProduct.style = style
        }

        if (data.hasOwnProperty("availableSizes")) {
            if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: " please insert the availableSizes" })
            availableSizes = availableSizes.toUpperCase().split(",");
            for (i of availableSizes) {
                if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(i)) {
                    return res.status(400).send({
                        status: false,
                        message: " Enter a valid availableSizes S, XS, M, X, L, XXL, XL "
                    })
                }
            }
            findProduct.availableSizes = availableSizes
        }

        if (data.hasOwnProperty("installments")) {
            if (!isValid(installments)) return res.status(400).send({ status: false, message: " please insert the installments" })
            if (isNaN(installments)) return res.status(400).send({ status: false, message: "installments should be a number" })
            findProduct.installments = installments
        }

        if (files.length > 0) {
            //if (files.length == 0) return res.status(400).send({ status: false, message: " please insert the Product Image" })
            mimetype = files[0].mimetype.split("/") //---["image",""]
            if (mimetype[0] !== "image") return res.status(400).send({ status: false, message: "Please Upload the Image File only" })
            if (files && files.length > 0) var uploadedFileURL = await uploadFile(files[0])
            findProduct.productImage = uploadedFileURL
        }



        const updatedata = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, findProduct, { new: true })
        return res.status(200).send({ status: true, message: 'Data successfully updated', data: updatedata })



    } catch (error) {
        return res.status(500).send({ status: true, message: error.message })
    }


}

exports.DeleteProducts = async (req, res) => {
    try {

        const productId = req.params.productId

        if (!validObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "Product id not valid" })

        const productDetail = await productModel.findOne({ _id: productId })
        if (!productDetail) return res.status(404).send({ status: false, message: "product not found" })

        if (productDetail.isDeleted) return res.status(400).send({ status: false, message: "Product already deleted" })

        const DeleteProduct = await productModel.findOneAndUpdate({ _id: productId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, message: "Product Deleted Succesfully" })

    } catch (error) {
        return res.status(500).send({ status: true, message: error.message })
    }



}

