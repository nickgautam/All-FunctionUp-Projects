const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    body: {
      type: String,
      required: true,
    },
    authorId: {
      type: ObjectId,
      ref: "projectAuthor",
    },
    category: {
      type: String,
      // enum: ["technology", "entertainment", "life style", "food", "fashion"],
      required: true,
    },
    subCategory:  [
      {
        type: String,
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blogDoc", blogSchema);
