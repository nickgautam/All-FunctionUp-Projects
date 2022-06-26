const mongoose= require("mongoose");
const ObjectId= mongoose.Schema.Types.ObjectId;
const blogSchema = new mongoose.Schema(
{
  title:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  authorId:{
    type: ObjectId,
    required: true,
    ref: "projectAuthor"
  },
  tags:[String],
  category:{
    type: String,
    required: true
  }, 
  subCategory:[String],
  isDeleted:{
  type: Boolean,
  default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  deletedAt:{
    type:Date,
    default: "" 
  }
 
},{ timestamps: true }
);

module.exports = mongoose.model("blogDoc", blogSchema )