const collegeModel = require("../models/collegeModel");
const jwt = require("jsonwebtoken");



const createCollege = async function (req, res) {
try {  
    let collegeData = req.body;
    if (Object.keys(collegeData).length == 0) {
      return res.status(400).send({ status: false, message: "data can't be empty" })}
    

    if (!collegeData.name)
      return res.status(400).send({ status: false, message: "Please include the name" });
    if (typeof (collegeData.name) != "string"){ return res.status(400).send({ status: false, message: "name must be a string" });}
    
    if ((collegeData.name).trim().length === 0){{return res.status(400).send({ status: false, message: "name can't be empty" });}}
    if (isNum(collegeData.name) === true) { return res.status(400).send({ status: false, message: "name cannot be a number" });}
    if ((collegeData.name).includes(" ")){{return res.status(400).send({ status: false, message: "Please remove any empty spaces in name" });}}
    
    if (!collegeData.fullName)
    return res.status(400).send({ status: false, message: "Please include the full name" });
    if (typeof (collegeData.fullName) != "string"){ return res.status(400).send({ status: false, message: "fullname must be a string" });}
    if ((collegeData.fullName).trim().length === 0){{return res.status(400).send({ status: false, message: "full name can't be empty" });}}
    if (isNum(collegeData.fullName) === true) { return res.status(400).send({ status: false, message: "full name cannot be a number" });}
    

    //logoLink
    if (!collegeData.logoLink)
    return res.status(400).send({ status: false, message: "Please include the logoLink" });
    if (typeof (collegeData.logoLink) != "string"){ return res.status(400).send({ status: false, message: "logoLink must be a string" });}
    if ((collegeData.logoLink).trim().length === 0){{return res.status(400).send({ status: false, message: "logoLink can't be empty" });}}
    if ((collegeData.logoLink).includes(" ")){{return res.status(400).send({ status: false, message: "Please remove any empty spaces in logoLink" });}}
    //validate correct URL- 
    }

    catch (err) {
        console.log("This is the error :", err.message);
        return res.status(500).send({ status: false, message: "Error", error: err.message });
      }
    }










//module.exports.createCollege = createCollege;