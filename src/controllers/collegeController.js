const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const mongoose = require ('mongoose');
// const jwt = require("jsonwebtoken");
function isNum(val){
  return !isNaN(val)
}

//--------CREATING A COLLEGE----------------------------------------------->>


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
    let nameOld = await collegeModel.findOne({name: collegeData.name})
    if (nameOld != null){{return res.status(400).send({ status: false, message: "name already exists" })}}
    
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
    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    if(!regex.test((collegeData.logoLink))){return res.status(400).send({ status: false, message: "Please use right logolink"})}



    let collegeCreated = await collegeModel.create(collegeData);
    return res.status(201).send({status: true,message: "data created successfully",data: collegeCreated,});
  } 
    

    catch (err) {
        console.log("This is the error :", err.message);
        return res.status(500).send({ status: false, message: "Error", error: err.message });
      }
    }


//----------------COLLEGE DETAILS------------------>

const collegeDetails = async function (req, res) {
    try {
      let requestedCollege = req.query;
      //console.log(requestedCollege)
      if (Object.keys(requestedCollege).length == 0) 
          return res.status(400).send({ status: false, message: "Please include some request in query"});
      if(!requestedCollege.collegeName)return res.status(400).send({ status: false, message: "Please include only collegeName in query"});
      if (Object.keys(requestedCollege).length > 1) 
          return res.status(400).send({ status: false, message: "Please include collegeName only"});
      if ((requestedCollege.collegeName).trim().length === 0){{return res.status(400).send({ status: false, message: "collegeName can't be empty space" });}}
      
      let thatCollege = await collegeModel.find({name: requestedCollege.collegeName})   
      if (thatCollege.length == 0)return res.status(400).send({ status: false, message: "no college exists of this collegeName"});
      let neededId = thatCollege[0].id
     let interns = await internModel.find({collegeId: neededId}).select({_id: 1,name:1,email:1,mobile:1})
    //thatCollege.Interns = interns
    let allTheInterns = interns;
    //console.log(interns)
    if (interns.length == 0){allTheInterns = "No interns applied at this college"}

    let savedData = await collegeModel.findOneAndUpdate({_id: neededId},
      {"$set": {interns : allTheInterns }},
      {new:true}).select({name:1, fullName:1, logoLink:1, _id:0,interns:1}) 
    return res.status(200).send({status: true,data: savedData});
  } 
 
     
     catch (err) {
      console.log("This is the error :", err.message);
      return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
  }

  








module.exports.createCollege = createCollege;
module.exports.collegeDetails = collegeDetails