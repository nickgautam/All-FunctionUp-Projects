const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

function isNum(val){
  return !isNaN(val)
}
function validateURL(url) {
  var urlPattern = /^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/gm
  return urlPattern.test(url);
}
//--------CREATING A COLLEGE----------------------------------------------->>


const createCollege = async function (req, res) {
try {  
    let collegeData = req.body;
    if (Object.keys(collegeData).length == 0) {
      return res.status(400).send({ status: false, message: "data can't be empty" })}
    
//""
    if (!collegeData.name)  
      return res.status(400).send({ status: false, message: "Please include the name" });
    if (typeof (collegeData.name) != "string"){ return res.status(400).send({ status: false, message: "name must be a string" });}
    
    if ((collegeData.name).trim().length === 0){{return res.status(400).send({ status: false, message: "name can't be empty" });}}
    if (isNum(collegeData.name) === true) { return res.status(400).send({ status: false, message: "name cannot be a number" });}
    if ((collegeData.name).includes(" ")){{return res.status(400).send({ status: false, message: "Please remove any empty spaces in name" });}}
    let collegeNameAlreadyExist  = await collegeModel.findOne({name: collegeData.name})
    if (collegeNameAlreadyExist  != null){{return res.status(400).send({ status: false, message: "collegeName already exists" })}}
    
    if (!collegeData.fullName)
    return res.status(400).send({ status: false, message: "Please include the full name" });
    if (typeof (collegeData.fullName) != "string"){ return res.status(400).send({ status: false, message: "fullName must be a string" });}
    if ((collegeData.fullName).trim().length === 0){{return res.status(400).send({ status: false, message: "fullName can't be empty" });}}
    if (isNum(collegeData.fullName) === true) { return res.status(400).send({ status: false, message: "fullName cannot be a number" });}
    
//"sfdgdsf gdfghfdhf"
    //logoLink
    if (!collegeData.logoLink)
    return res.status(400).send({ status: false, message: "Please include the logoLink" });
    if (typeof (collegeData.logoLink) != "string"){ return res.status(400).send({ status: false, message: "logoLink must be a string" });}
    if ((collegeData.logoLink).trim().length === 0){{return res.status(400).send({ status: false, message: "logoLink can't be empty" });}}
    if ((collegeData.logoLink).includes(" ")){{return res.status(400).send({ status: false, message: "Please remove any empty spaces in logoLink" });}}
    //validate correct URL- 
    
    if((!validateURL(collegeData.logoLink))){return res.status(400).send({ status: false, message: "Please use right logoLink"})} 
  


    let collegeCreated = await collegeModel.create(collegeData);
    return res.status(201).send({status: true, data: collegeCreated,});
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
      //""
      let thatCollege = await collegeModel.findOne({name: requestedCollege.collegeName})   
      if (thatCollege == null)return res.status(400).send({ status: false, message: "no college exists of this collegeName"});
      let neededId = thatCollege._id   
     let interns = await internModel.find({collegeId: neededId, isDeleted:false}).select({_id: 1,name:1,email:1,mobile:1})
    console.log(interns)
    let allTheInterns = interns;
    
    if (interns.length == 0){allTheInterns = "No interns applied at this college"}

    let savedData = await collegeModel.findOneAndUpdate({_id: neededId},
      {"$set": {interns : allTheInterns }},
      {new:true,upsert: true,strict:false}).select({name:1, fullName:1, logoLink:1, _id:0,interns:1}) 
     // console.log(savedData)
    return res.status(200).send({data: savedData});
   
  } 
 
         
     catch (err) {
      console.log("This is the error :", err.message);
      return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
  }

  








module.exports.createCollege = createCollege;
module.exports.collegeDetails = collegeDetails