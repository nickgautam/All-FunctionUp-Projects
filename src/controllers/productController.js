const productModel = require('../models/productModel')


exports.createProducts =(req,res)=>{
try{
let data= req.body
let files= req.files
let {title, description, price, currencyId, currencyFormat, productImage, style, availableSizes, installments, ...rest} =data
if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter some data in request body" })
if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribute in request body" })
if (!title) return res.status(400).send({ status: false, message: "title is required" })
if (!description) return res.status(400).send({ status: false, message: "description is required" })
if (!price) return res.status(400).send({ status: false, message: "price is required" })
if (!currencyId) return res.status(400).send({ status: false, message: "currencyId is required" })
if (!currencyFormat) return res.status(400).send({ status: false, message: "currencyFormat is required" })

if (!isValid(title)) return res.status(400).send({ status: false, message: " title is invalid " })
if (!isValid(description)) return res.status(400).send({ status: false, message: " description  is invalid " })
if (!isValid(price)) return res.status(400).send({ status: false, message: " price  is invalid " })
if (!isValid(currencyId)) return res.status(400).send({ status: false, message: " currencyId is invalid " })
if (!isValid(currencyFormat)) return res.status(400).send({ status: false, message: " currencyFormat  is invalid " })
if (!isValid(style)) return res.status(400).send({ status: false, message: " style is invalid " })

if(!NaN(description))return res.status(400).send({status:false, message:"description can't be a number"})
if(NaN(installments))return res.status(400).send({status:false, message:"installments should be a number"})
if (!files.length) return res.status(400).send({ status: false, message: "Please Provide the Image file" })
mimetype = files[0].mimetype.split("/") //---["image",""]
if (mimetype[0] !== "image") return res.status(400).send({ status: false, message: "Please Upload the Image File only" })
if (files && files.length > 0) var uploadedFileURL = await awsController.uploadFile(files[0])
data.productImage = uploadedFileURL


if (["S", "XS","M","X", "L","XXL", "XL"].indexOf(availableSizes) == -1) {
    return res.status(400).send({
        status: false,
        message: " Enter a valid availableSizes S, XS, M, X, L, XXL, XL "
    })
}
data[deletedAt] =new Date()
let checkTitle= await productModel.findOne({title:title})
if(checkTitle) return res.status(400).send({status:false, message:"title already exists"})

let product= await productModel.create(data);
return res.status(201).send({status:true, message:"Product created successfully", data: product})

}catch(err){return res.status(500).send({status:false, message:err.message})}


}



exports.getProducts =(req,res)=>{



}



exports.getProductsById =(req,res)=>{



}



exports.UpdateProducts =(req,res)=>{



}





exports.DeleteProducts =(req,res)=>{



}

