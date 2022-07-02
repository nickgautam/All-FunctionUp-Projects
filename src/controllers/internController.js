const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");


function isNum(val) {
  return !isNaN(val)
}


//--------CREATING AN INTERN------------------------------------------------>>


const createIntern = async function (req, res) {
  try {
    let internData = req.body;
    if (Object.keys(internData).length == 0) {
      return res.status(400).send({ status: false, message: "data can't be empty" });
    }
    if (!internData.name)
      return res.status(400).send({ status: false, message: "Please include the name" });
    
      if (typeof (internData.name) != "string") { return res.status(400).send({ status: false, message: "name must be a string" }); }
//"dtgdfg"
    if ((internData.name).trim().length === 0) { { return res.status(400).send({ status: false, message: "name can't be empty" }); } }
   
    if (isNum(internData.name) === true) { return res.status(400).send({ status: false, message: "name cannot be a number" }); }

    if (!internData.email) { return res.status(400).send({ status: false, message: "Please include an email" }) };

    if (typeof (internData.email) != "string") { return res.status(400).send({ status: false, message: "Email is not string" }); }

    if ((internData.email).trim().length === 0) { return res.status(400).send({ status: false, message: "email can't be empty" }); }
    
    if ((internData.email).includes(" ")) { { return res.status(400).send({ status: false, message: "Please remove any empty spaces in email" }); } }

    let regex = /^[a-z]{2,}[0-9]{2,}@+[a-z]{4,}\.[a-z]{2,4}$/          //[a-z0-9]+@[a-z]+\.[a-z]{2,3}
    
    if (!regex.test((internData.email))) { return res.status(400).send({ status: false, message: "email should look like this lowercasetext12@gmail.com, contains first atleast two alphabets ,then minimum two digits & not include any space " }) }

    let emailAlreadyExist = await internModel.findOne({ email: internData.email })
    
    if (emailAlreadyExist != null) { { return res.status(400).send({ status: false, message: "email already exists" }) } }

    if (!internData.mobile)
      return res.status(400).send({ status: false, message: "Please include the mobile no." });

    if (typeof (internData.mobile) != "string") { return res.status(400).send({ status: false, message: "mobile should be inside quotes" }); }
   
    if ((internData.mobile).trim().length === 0) { { return res.status(400).send({ status: false, message: "mobile can't be empty" }); } }

    if ((internData.mobile).includes(" ")) { { return res.status(400).send({ status: false, message: "Please remove any empty spaces in mobile" }); } }
//"34523232"
    if (isNaN(internData.mobile) || (internData.mobile).indexOf(" ") != -1) {
      return res.status(400).send({ status: false, message: "mobile must be a number and should not contain any space in between" })
    }

    if ((internData.mobile).length != 10) return res.status(400).send({ status: false, message: "mobile must be a 10 digits" })

    if ((internData.mobile).charAt(0) == 0) return res.status(400).send({ status: false, message: "mobile should not start with 0" })

    let mobileAlreadyExist = await internModel.findOne({ mobile: internData.mobile })
    if (mobileAlreadyExist != null) { { return res.status(400).send({ status: false, message: "mobile already exists" }) } }

    //collegeName  
    if (!internData.collegeName) { return res.status(400).send({ status: false, message: "Please include the collegeName" }) }

    if ((internData.collegeName).trim().length === 0) { return res.status(400).send({ status: false, message: "collegeName can't be empty" }) }

    if ((internData.collegeName).includes(" ")) { { return res.status(400).send({ status: false, message: "Please remove any empty spaces in collegeName" }); } }

    let collegeId = await collegeModel.findOne(({ name: (internData.collegeName) })).select({_id:1})
    console.log(collegeId)
    if (collegeId == null) { return res.status(400).send({ status: false, msg: "Please use right collegeName" }) };
    //console.log((internData.collegeName))
    
    //internData['collegeId'] = internData['collegeName'];
    delete internData['collegeName'];

    //console.log(internData);

    internData["collegeId"] = (collegeId)

    let savedData = await internModel.create(internData)
    let reqData = await internModel.findById(savedData._id).select({ _id: 0, name: 1, email: 1, mobile: 1, collegeId: 1, isDeleted: 1 });
   console.log(reqData)
 return res.status(201).send({ data: reqData, })

  } catch (err) {
    console.log("This is the error :", err.message);
    return res.status(500).send({ status: false, message: "Error", error: err.message });
  }
}


module.exports.createIntern = createIntern;