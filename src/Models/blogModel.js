const mongoose= require("mongoose");
const ObjectId= mongoose.Schema.Types.ObjectId;
const blogSchema = new mongoose.Schema(
{
  title:{
    type: String,
    required: true,
    trim: true
  },
  body:{
    type: String,
    required: true,
    trim: true
  },
  authorId:{
    type: ObjectId,
    required: true,
    ref: "projectAuthor",
    trim: true
  },
  tags:{
    type: [String],
  },
  category:{
    type: String,
    required: true,
    trim: true
  }, 
  subCategory:{
    type:[String],
    trim: true
  },
  isDeleted:{
  type: Boolean,
  default: false,
 
  },
  isPublished: {
    type: Boolean,
    default: false,
   
  }
  
},{ timestamps: true }
);

module.exports = mongoose.model("blogDoc", blogSchema )