
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route/route.js');
const { default: mongoose } = require('mongoose');
const app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mongodb+srv://neesh:E8DNG8XaM4rrzJCV@cluster0.vlwog.mongodb.net/group45Database

mongoose.connect("mongodb+srv://neesh:E8DNG8XaM4rrzJCV@cluster0.vlwog.mongodb.net/group45Database", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
