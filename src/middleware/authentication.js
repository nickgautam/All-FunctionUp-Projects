const jwt = require("jsonwebtoken");

const authenticate = async function (req, res, next) {

    try {
        let token = req.headers["x-api-key"];         
        if (!token) {    

            token = req.headers["X-Api-Key"];     
        }
        if (!token) return res.status(400).send({ status: true, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "blogProject");

    } catch (error) {return res.status(500).send({ status: false, msg: error.message })};

    next();

}

module.exports.authenticate = authenticate

