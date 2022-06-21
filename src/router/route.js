const express = require("express");
const router = express.Router();
const authorController = require("../Controllers/authorController");
const blogController = require("../Controllers/blogcontroller");

router.post("/authors", authorController.createAuthor);

router.post("/blogs", blogController.createBlogDoc);
router.get("/blogs",blogController.blogs)
module.exports = router;
