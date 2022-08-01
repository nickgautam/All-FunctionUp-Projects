const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        if (!token) return res.status(400).send({ status: false, message: "Token is missing" });
        token = token.split(" ")
        let decodedToken = jwt.verify(token[1], "my@fifth@project@product@management", function (err, data) {
            if (err) return null
            else {return data}
        });
        if(!decodedToken) return res.status(401).send({ status: false, message: "Token is invalid" });
        // console.log(decodedToken)
        if(req.params.userId !== decodedToken.userId) return res.status(403).send({ status: false, message: "User logged is not authorized to access & manipulate other's data" });
        next();
    } catch (error) { 
        return res.status(500).send({ status: false, message: error.message })
    }



}
