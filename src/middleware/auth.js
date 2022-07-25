const jwt =require('jsonwebtoken')

exports.auth =async (req,res,next)=>{
  try {
        let token = req.headers.authorization

        if (!token) {
          return res.status(400).send({ status: false, message: "Token is missing" });
        }
        let splitToken =token.split(' ')
        
        let decodedToken = jwt.verify(splitToken[1], "my@fifth@project@product@management");
        if(!decodedToken){
          return res.status(401).send({status:false, message:"Invalid token"})
        }
        req.userId = decodedToken.userId;
        next();
      } catch (error) { 
        return res.status(500).send({ status: false, error: error.message })
      }
    

    
}