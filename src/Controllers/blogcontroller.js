const authorModel = require("../Models/authorModel");
const blogModel= require("../Models/blogModel");
const lodash=require("lodash");
const moment= require("moment");
const mongoose= require("mongoose");

//>----------------------------------------------- post Api----------------------------------------------------->
const createBlog= async function(req , res){
  try {
     let blogData= req.body;
    if(Object.keys(blogData).length!==0){
        let authorId= req.body.authorId;
        let authorDetails = await authorModel.findById(authorId);
        if(!authorDetails) return res.status(404).send({status: false , msg: "No author exists with this authorId"});
        let savedblogData= await blogModel.create(blogData);
        res.status(201).send({status: true , data: savedblogData });
    } else{res.status(400).send({status: false, msg: " Bad Request , Mention some data in the request body"})}
    } catch(err){res.status(500).send({status: false, msg: err.message})}
};
 
module.exports.createBlog= createBlog;

//>----------------------------------------------- Get Api----------------------------------------------------->

const getBlog = async function(req, res){
 
  try{ 
    let filterQuery= {isPublished: true,isDeleted: false}
    if(req.query.tags)
    {filterQuery["tags"]={"$in":req.query.tags}};
    if(req.query.subCategory)
    {filterQuery["subCategory"]={"$in":req.query.subCategory}};
    if(req.query.category)
    {filterQuery["category"]=req.query.category};
    if(req.query.authorId)
    {filterQuery["authorId"]=req.query.authorId};
   console.log(filterQuery);
    let blogDetails= await blogModel.find(filterQuery);
    if(blogDetails.length==0)return res.status(404).send({status: false, msg: "No data found"});
    res.status(200).send({status:true , data: blogDetails});
    } catch(err){res.status(500).send({status:false, msg:err.message})};
}

module.exports.getBlog= getBlog;

//>----------------------------------------------- put Api----------------------------------------------------->

const updateBlog = async (req, res) => {
  try {
      let blog = req.body;
      if (Object.keys(blog).length===0) return res.status(400).send({ status: false, msg: "Bad Request! Request body can not be empty" });
      let blogId = req.params.blogId;
      let blogToBeUpdted = await blogModel.findOne({ _id: blogId, isDeleted: false });
      console.log(blogToBeUpdted);
      if (!blogToBeUpdted) return res.status(404).send({ status: false, msg: "Blog does not exist" });
      if(req.query.tags)
      blog["tags"] = lodash.uniq(blogToBeUpdted.tags.concat(req.body.tags));
      if(req.query.subCategory)
      blog["subCategory"] = lodash.uniq(blogToBeUpdted.subCategory.concat(req.body.subCategory));
      blog["isPublished"] = true
      blog["publishedAt"] = moment().format("YYYY-MM-DDThh:mm:ss.SSS[Z]");

      let blogUpdated = await blogModel.findOneAndUpdate({ _id: blogId }, blog, { new: true, upsert: true, strict: false })
      console.log(blogUpdated);  
      if (!blogUpdated) {
          return res.status(404).send({ status: false, msg: "Blog does not exist" })
      }

      return res.status(201).send({ status: true, data: blogUpdated })
  } catch (error) {
      res.status(500).send({ status: false, msg: error.message })
  }

}

module.exports.updateBlog= updateBlog;

//>----------------------------------------------- delete Api----------------------------------------------------->

const blogDeleteById = async (req, res) => {
  try {
  let blogId = req.params.blogId;
  let blogToBeDeleted = await blogModel.findOne({ _id: blogId, isDeleted: false })
  if (!blogToBeDeleted) return res.status(404).send({ status: false, msg: "Blog does not exist" });
  await blogModel.findOneAndUpdate({ _id: blogId }, {$set: {isDeleted: true, deletedAt: moment().format("YYYY-MM-DDThh:mm:ss.SSS[Z]")} }, {new:true})
  res.status(200).send()
  } catch (error) {
      res.status(500).send({ status: false, msg: error.message })
  }
}

module.exports.blogDeleteById = blogDeleteById;

//>----------------------------------------------- delete Api----------------------------------------------------->

const blogDeleteByQuery = async (req, res) => {
    
  try {
    let Query= {};
    if(req.query.tags)
    {Query["tags"]={"$in":req.query.tags}};
    if(req.query.subCategory)
    {Query["subCategory"]={"$in":req.query.subCategory}};
    if(req.query.category)
    {Query["category"]=req.query.category};
    if(req.query.authorId)
    {Query["authorId"]=req.query.authorId};
      if (Object.keys(Query).length===0) return res.status(400).send({ status: false, msg: "Bad Request! You cann't delete by other query except tags, category, subCategory & authorId." });
  let blogToBeDeleted = await blogModel.find(Query);
  console.log(blogToBeDeleted);
  if (blogToBeDeleted.length===0) return res.status(404).send({ status: false, msg: "Blog Does Not Exist" });
  for(let i=0;i<blogToBeDeleted.length;i++){
    let temp = JSON.parse(JSON.stringify(blogToBeDeleted[i]));
    temp["deletedAt"] = moment().format("YYYY-MM-DDThh:mm:ss.SSS[Z]");
    temp.isDeleted = true
    let blogId = temp["_id"];
    console.log(blogId)
    await blogModel.findOneAndUpdate( {_id:blogId}, temp,{ new: true, upsert: true, strict: false })
    res.status(200).send()
  }
}catch(err){res.status(500).send({status: false, msg: err.message})}

}
module.exports.blogDeleteByQuery = blogDeleteByQuery;
  































