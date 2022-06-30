const mongoose = require ('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({

     name: {
        type: String,
        required: true,
        unique: true,
        trim: true
        },
        


    email: { 
    type: String,
    required: true,
    //match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,"Fill a valid email address"],
    unique: true
    },

    mobile: {
        required: true,  
        type: Number,
         unique: true
        //match: [/^(\+?\d{1,4}[\s-])?(?!0+\s+,?$)\d{10}\s*,?$/, "Please fill a valid mobile number"] 
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