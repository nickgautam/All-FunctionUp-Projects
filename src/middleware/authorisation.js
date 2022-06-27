const authorModel = require('../Models/authorModel');
const blogModel = require('../Models/blogModel');
const jwt = require("jsonwebtoken");

const authorise = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {

            token = req.headers["X-Api-Key"];
        }
        let decodedToken = jwt.verify(token, "blogProject");
        console.log(decodedToken);
        console.log(req.query.authorId)
        if (decodedToken.authorId !== req.query.authorId)
            return res.status(400).send({ status: false, msg: "User logged is not allowed to modify the other's data"});
        
    }catch (err) {res.status(500).send({ msg: "Error", msg: err.message })}
    next();
}
module.exports.authorise = authorise;


const authorised = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {

            token = req.headers["X-Api-Key"];
        }
        let decodedToken = jwt.verify(token, "blogProject");
        console.log(decodedToken)
        let blogId= req.params.blogId;
        var regex = /^[0-9a-f]{24}$/;
        if (!regex.test(blogId)) 
           return res.status(400).send({ status: false, msg: `blogId is not valid` });
           
        let authorIdByBlog= await blogModel.findById(blogId).select({authorId:1, _id:0});
        let newAuthorId = authorIdByBlog.authorId;
        console.log(newAuthorId)
        if(!authorIdByBlog) return res.status(404).send({status:false, msg: "blog doesn't exist with this blogId"})

        if (decodedToken.authorId !== newAuthorId.toString())
            return res.status(400).send({ status: false, msg: "User logged is not allowed to modify the other's data"});
          
        }catch (err) {res.status(500).send({status:false, msg: err.message })}
        next();
}
module.exports.authorised = authorised;