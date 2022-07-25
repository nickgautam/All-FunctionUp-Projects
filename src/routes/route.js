const express = require("express")
const router = express.Router()




router.get("/text", function(req, res){
    res.send({message: "hello"})
})







module.exports= router