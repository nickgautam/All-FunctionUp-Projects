const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    fname:{
        type:string,
        required:true
    },
    lname:{type:string,
    required:true},
    title:{
        required:true,
        enum:[Mr,Mrs,Miss]},
    email: {type:string,
               required:true,
              unique:true},
    password:{type:string,
        required:true}
    },{ timestamps: true });

module.exports = mongoose.model('projectAuthor', authorSchema) 