const blogModel = require("../Models/blogModel")
const moment = require('moment')
const lodash = require('lodash')
const { trusted } = require("mongoose")



/*####################################################### POST API ####################################################*/

const createBlogDoc = async function (req, res) {
    try {
        let blogData = req.body
        //consol.log(blogData)
        if ( Object.keys(blogData).length != 0) {
            let savedblogData = await blogModel.create(blogData)
            res.status(201).send({ msg: savedblogData })
        }
        else res.status(400).send({ msg: "BAD REQUEST"})
    }
    
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

/*############################################################## GET API #######################################*/

const blogs = async (req,res)=>{
    let a =req.query
    //req.query["isDeleted"] = false
    //req.query["isPublished"] = true
    let blogs = await blogModel.find({a}, {isDeleted:false}, {isPublished:true} )
    
           if(Object.keys(blogs).length === 0){
               return res.status(404).send({status:false,msg:"Data not Found"})
            }
            
            return res.status(200).send({status:true,data:blogs})
    
    }







/*##################################################### PUT API ##################################################*/


const blogPut = async (req,res)=>{


    try {
        let blog = req.body;
    if(!blog) return res.status(400).send({status:false,msg:"Bad Request"});
    let blogId = req.params.blogId;
    let blogToBeUpdted = await blogModel.findByOne({_id:blogId,isDeleted:false})
    if(!blogToBeUpdted) return res.status(404).send({status:false,msg:"Use Not Exist"});
    blog["tags"] = lodash.uniq(req.body.tags.concat(blogToBeUpdted.tags));
    blog["subCategory"] = lodash.uniq(req.body.subCategory.concat(blogToBeUpdted.subCategory));
    blog["isPublished"] = true
    blog["publishedAt"] = moment().format("YYYY MM DDThh:mm:ss SSS[Z]");
    let blogUpdated = await blogModel.findOneAndUpdate({_id:blogId},{blog},{new:true})

    if(!blogUpdated){
        return res.status(404).send({status:false,msg:"Use Not Exist"})
     }
     
     return res.status(201).send({status:true,data:blogUpdated})
    } catch (error) {
        res.status(500).send({status:false,msg:error.message})
    }

}



/*############################################# DELETE APIS ################################################*/


const blogDeletById = async (req,res)=>{
    let blogId = req.params.blogId;
    if(!blogId) return res.status(400).send({status:false,msg:"Bad Request"});
    let blogToBeDeleted = await blogModel.findOne({_id:blogId,isDeleted:false})
    if(!blogToBeDeleted) return res.status(404).send({status:false,msg:"Blog DoesNot Exist"});
    await blogModel.findOneAndUpdate({_id:blogId},{isDeleted:true})
    res.status(200).send()
}


const blogDeletByParams = async (req,res)=>{
    if(!req.query) return res.status(400).send({status:false,msg:"Bad Request"});
    let blogToBeDeleted = await blogModel.findOne(req.query)
    if(!blogToBeDeleted) return res.status(404).send({status:false,msg:"Blog DoesNot Exist"});
    let x = req.query
    await blogModel.findOneAndUpdate({x},{isDeleted:true})
    res.status(200).send()
}






    module.exports.blogs=blogs
    module.exports.createBlogDoc=createBlogDoc
    module.exports.blogPut = blogPut
    module.exports.blogDeletById = blogDeletById
    module.exports.blogDeletByParams = blogDeletByParams