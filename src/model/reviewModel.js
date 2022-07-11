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
        trim : true
    },

    reviewedAt : {
        type : Date,
        required : true,
        trim : true
    },

    rating : {
        type : Number,
        required : true,
        trim : true
    },

    review : {
        type : String,
        trim : true
    },

    isDeleted : {
        type : Boolean,
        default : false
    }
})


modeule.export = mongoose.Model("review", reviewSchema)