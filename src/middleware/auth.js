const jwt = require("jsonwebtoken");
const bookModel = require('../model/bookModel');


/*--------------------------------------Authentication for all books related Api--------------------------------*/
const authentication = async function (req, res, next) {

    try {
        let token = req.headers["x-api-key"];
        if (!token) {

            token = req.headers["X-Api-Key"];
        }
        if (!token) return res.status(400).send({ status: false, message: "token must be present" });

        jwt.verify(token, "my@third@project@book@management", function (error) {
            if (error) return res.status(401).send({ status: false, message: "Token is invalid" })
        });

    } catch (error) {
         res.status(500).send({ status: false, message: error.message })
         return
         };

    next();

}

module.exports.authentication = authentication



/*--------------------------------------Authoraisation for create book Api--------------------------------*/

const authorisationCreateBook = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {

            token = req.headers["X-Api-Key"];
        }
        let decodedToken = jwt.verify(token, "my@third@project@book@management");
        console.log(decodedToken)
        let userId = req.body.userId;
        let regex = /^[0-9a-f]{24}$/;
        if (!regex.test(userId))
            return res.status(400).send({ status: false, message: `userId is not valid` });

        if (decodedToken.userId !== userId)
            return res.status(400).send({ status: false, message: "User logged is not allowed to create the book" });

    } catch (err) { res.status(500).send({ status: false, message: err.message }) }
    next();
}
module.exports.authorisationCreateBook = authorisationCreateBook;



/*--------------------------------------Authoraisation for update books and delete books Api--------------------------------*/

const authorisationByParams = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {

            token = req.headers["X-Api-Key"];
        }
        let decodedToken = jwt.verify(token, "my@third@project@book@management");
        console.log(decodedToken)
        let bookId = req.params.bookId;
        let regex = /^[0-9a-f]{24}$/;
        if (!regex.test(bookId))
            return res.status(400).send({ status: false, message: `bookId is not valid` });

        let particularBook = await bookModel.findById(bookId).select({ userId: 1, _id: 0 });

        if (!particularBook) return res.status(404).send({ status: false, message: "book doesn't exist with this bookId" })

        let newUserId = particularBook.userId;
        console.log(newUserId)

        if (decodedToken.userId !== newUserId.toString())
            return res.status(400).send({ status: false, message: "User logged is not allowed to modify the other's data" });

    } catch (err) { res.status(500).send({ status: false, message: err.message }) }
    next();
}
module.exports.authorisationByParams = authorisationByParams;   