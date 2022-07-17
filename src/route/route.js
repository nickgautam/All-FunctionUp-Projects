const express = require('express')
const userController = require('../controller/userController')
const bookController = require('../controller/bookController')
const reviewController = require('../controller/reviewController')
const router = express.Router()
const auth= require("../middleware/auth")

   
router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)
router.post('/books', auth.authentication, bookController.createBook)
router.get('/books', auth.authentication, bookController.getBook)
router.get('/books/:bookId',auth.authentication,  bookController.getBookById)
router.put('/books/:bookId', auth.authentication, auth.authorisationByParams, bookController.updateBookById)
router.delete('/books/:bookId', auth.authentication, auth.authorisationByParams, bookController.deleteBookById)
router.post('/books/:bookId/review', reviewController.createReview)
router.put('/books/:bookId/review/:reviewId', reviewController.updateReviewById)
router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReviewById)

router.all("/****", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct or Not!"
    })
})


module.exports = router

















