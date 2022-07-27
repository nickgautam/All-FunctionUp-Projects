const productModel = require('../models/productModel')
const {isValid,parseJSONSafely}= require("../validator/validator")
const {uploadFile}= require("./awsController")

const validTitle = /^[a-zA-Z ]{3,20}$/
// const validEmail = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
// const validPhoneNumber = /^[0]?[6789]\d{9}$/
// const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*#?&]{8,15}$/;


exports.createProducts =async (req,res)=>{
try{
let data= req.body
let files= req.files

//data = JSON.parse(JSON.stringify(data))
let { title, description, price, currencyId, currencyFormat, productImage, style, availableSizes, installments, ...rest} =data
if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter some data in request body" })
//if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribute in request body" })
console.log(title)
if (!title) return res.status(400).send({ status: false, message: "title is required" })
if (!description) return res.status(400).send({ status: false, message: "description is required" })
if (!price) return res.status(400).send({ status: false, message: "price is required" })
if (!currencyId) return res.status(400).send({ status: false, message: "currencyId is required" })
if (!currencyFormat) return res.status(400).send({ status: false, message: "currencyFormat is required" })

//if (!isValid(title)) return res.status(400).send({ status: false, message: " title is invalid " })
if (!isValid(description)) return res.status(400).send({ status: false, message: " description  is invalid " })
if (!isValid(price)) return res.status(400).send({ status: false, message: " price  is invalid " })
if (!isValid(currencyId)) return res.status(400).send({ status: false, message: " currencyId is invalid " })
if (!isValid(currencyFormat)) return res.status(400).send({ status: false, message: " currencyFormat  is invalid " })

if(!validTitle.test(title)) return res.status(400).send({ status: false, message: " title is invalid " })
if (typeof style === "string" && style.trim().length === 0) return res.status(400).send({ status: false, message: " style is invalid " })

if(!isNaN(description))return res.status(400).send({status:false, message:"description can't be a number"})
if(installments){
    if(isNaN(installments))return res.status(400).send({status:false, message:"installments should be a number"})
}
if (!files.length) return res.status(400).send({ status: false, message: "Please Provide the Image file" })
mimetype = files[0].mimetype.split("/") //---["image",""]
if (mimetype[0] !== "image") return res.status(400).send({ status: false, message: "Please Upload the Image File only" })
if (files && files.length > 0) var uploadedFileURL = await uploadFile(files[0])
data.productImage = uploadedFileURL


if (["S","XS","M","X", "L","XXL", "XL"].indexOf(availableSizes) == -1) {
    return res.status(400).send({
        status: false,
        message: " Enter a valid availableSizes S, XS, M, X, L, XXL, XL "
    })
}

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

