const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId : {
        type : ObjectId,
        required : true,
        ref : 'book'
    },

    reviewedBy : {
        type: String,
        required : true,
        value : "reviewer's name",
        trim : true
    },

    reviewedAt : {
        type : Date,
        required : true,
    },

    rating : {
        type : Number,
        required : true,
    },

    review : {
        type : String,
    },

    isDeleted : {
        type : Boolean,
        default : false
    }
})


modeule.export = mongoose.Model("review", reviewSchema)