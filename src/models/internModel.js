const mongoose = require ('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({

     name: {
        type: String,
        required: true,
        trim: true
        },
        
    email: { 
    type: String,
    required: true,
    unique: true
    },

    mobile: {
        required: true,  
        type: Number,
         unique: true
         
    },

    collegeId: {
            type: ObjectId,
            ref: 'college'
        },


    isDeleted: {
        default: false,
        type: Boolean
     }
     

    
 },
{ timestamps: true });



module.exports = mongoose.model('intern', internSchema)        //interns