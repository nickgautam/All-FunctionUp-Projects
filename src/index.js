const express =  require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./route/route.js');
const multer = require('multer');

const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use( multer().any() )


const monngodb_url="mongodb+srv://NishantGautam:Ng123@cluster0.45vj3.mongodb.net/group44Database";

mongoose.connect(monngodb_url,{useNewUrlParser: true}).then(()=>{ console.log("Hi! MongoDB is connected Now ");})
.catch ( err => console.log(err) );

app.use('/', route);


app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
