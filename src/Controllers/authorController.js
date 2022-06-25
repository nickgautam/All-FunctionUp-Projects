const authorModel= require("../Models/authorModel");

const createAuthor= async function(req, res){
 try{
  let data = req.body;
  if(Object.keys(data).length!==0){
    let savedData= await authorModel.create(data);
    res.status(201).send({status: true , data: savedData});
  }
  else{res.status(400).send({status: false , msg: "Bad request! Request body can not be empty"})}
  } catch(err){res.status(500).send({status: false, msg: err.message})}
};

module.exports.createAuthor= createAuthor;




