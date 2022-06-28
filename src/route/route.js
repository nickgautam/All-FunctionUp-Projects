const express = require('express');
const router = express.Router();
const collegeController= require("../controllers/collegeController")
const internController= require("../controllers/internController")
const middleware= require("../middleware/auth") 






router.post("/functionup/colleges", collegeController.createCollege )
router.post("/functionup/interns", internController.createIntern )
router.get("/functionup/collegeDetails",collegeController.collegeDetails)







module.exports = router