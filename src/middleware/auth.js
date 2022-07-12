const jwt = require("jsonwebtoken");
const bookModel = require('../model/bookModel');
const userModel = require('../model/userModel')
const validator = require('../validation/validation')

//***************************************** Authentication for all books related Api **********************************************************/

const authentication = async function (req, res, next) {

    try {
        let token = req.headers["x-api-key"];
        if (!token) {

            token = req.headers["X-Api-Key"];
        }
        if (!token) return res.status(400).send({ status: false, message: "token must be present" });

        jwt.verify(token, "my@third@project@book@management", function (error) {
            if (error) return res.status(401).send({ status: false, message: "Token is invalid" })
            next();
        });


    } catch (error) { return res.status(500).send({ status: false, message: error.message }) };

}


//***************************************** Authorisation for create book Api **********************************************************/


const authorisationCreateBook = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {

            token = req.headers["X-Api-Key"];
        }
        let decodedToken = jwt.verify(token, "my@third@project@book@management");
        console.log(decodedToken)

        let data = req.body
        let userId = data.userId;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Request body can't be empty"
            })
        }

        if (!userId) {
            return res.status(400).send({
                status: false,
                message: "userId is mandatory"
            })
        }
       

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({
                status: false,
                message: `userId is not valid`
            });
        }
 
        let userExistance = await userModel.findById(userId)
        if(!userExistance){
            return res.status(404).send({
                status: false, 
                message: "No user exists with this userId"
            })
        }

        if (decodedToken.userId !== userId) {
            return res.status(403).send({ status: false, message: "User logged is not allowed to create the book" });
        } next();
    } catch (err) { res.status(500).send({ status: false, message: err.message }) }

}



//***************************************** Authorisation for update books and delete books API **********************************************************/


const authorisationByParams = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {

            token = req.headers["X-Api-Key"];
        }
        let decodedToken = jwt.verify(token, "my@third@project@book@management");
        console.log(decodedToken)
        let bookId = req.params.bookId;
     

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({
                status: false,
                message: `bookId is not valid`
            });
        }

        let particularBook = await bookModel.findById(bookId).select({ userId: 1, _id: 0 });

        if (!particularBook) return res.status(404).send({ status: false, message: "book doesn't exist with this bookId" })

        let newUserId = particularBook.userId;
        console.log(newUserId)

        if (decodedToken.userId !== newUserId.toString())
            return res.status(403).send({ status: false, message: "User logged is not allowed to modified other's data" });
        next();
    } catch (err) { res.status(500).send({ status: false, message: err.message }) }

}


module.exports.authentication = authentication
module.exports.authorisationCreateBook = authorisationCreateBook;
module.exports.authorisationByParams = authorisationByParams;   