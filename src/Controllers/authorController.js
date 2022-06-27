const authorModel= require("../Models/authorModel");
const jwt= require("jsonwebtoken")

//>--------------------------------------------post Api-------------------------------------------->

const createAuthor= async function(req, res){
 try{
  let data = req.body;
  let Email= req.body.email;
  if(Object.keys(data).length!==0){
   let alreadyAuthorExist= await authorModel.find({"email": Email});
      if(alreadyAuthorExist.length!==0) return res.status(400).send({status:false, msg:"email is already exist in database. Always use unique email to create author data"})
    let savedData= await authorModel.create(data);
    res.status(201).send({status: true , data: savedData});
  }
  else{res.status(400).send({status: false , msg: "Bad request! Request body can not be empty"})}
  } catch(err){res.status(500).send({status: false, msg: err.message})}
};

module.exports.createAuthor= createAuthor;

//>------------------------------------------post Api-------------------------------------------------->

const authorLogin= async function(req, res) {
try {
   let loginCredentials= {};
  if(req.body.email){
    loginCredentials["email"]= req.body.email;
  }
  if(req.body.password){
    loginCredentials["password"]= req.body.password;
  }
  if(Object.keys(loginCredentials).length===0) return res.status(400).send({status: false, msg: "Bad request! Body should only contain valid email and password."});
  let authorDetails= await authorModel.findOne(loginCredentials);
  if(!authorDetails) return res.status(400).send({status:false, msg:" email and password are not valid"});
  let token = jwt.sign(
    {
      authorId: authorDetails._id.toString(),
    }, "blogProject");
  res.setHeader("x-api-key", token);
  res.status(201).send({ status: true, token: token })

}catch(err){res.status(500).send({ status:false, msg: err.message })}

}

module.exports.authorLogin= authorLogin;
