const express = require("express")
const mongoose= require("mongoose")
const route = require("./routes/route")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.JSON())
app.use(bodyParser.urlencoded(),{extended: true})

const url = "mongodb+srv://NishantGautam:Ng123@cluster0.45vj3.mongodb.net/group41Database"

mongoose.connect(url, {newurlencoded: true})