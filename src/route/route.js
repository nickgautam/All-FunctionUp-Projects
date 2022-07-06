const express = require('express')
const userModel = require('../model/userModel')
const bookModel = require('../model/bookModel')
const router = express.Router()


router.post('/register', userModel.createUser)

router.post('/login', userModel.loginUser)

router.post('/books', bookModel.createBook)

router.get('/books', bookModel.getBook)

router.get('/books/:bookId', bookModel.getBookById)

router.put('/books/:bookId', bookModel.updateBookById)

router.delete('/books/:bookId', bookModel.deleteBookById)


router.post('/books/:bookId/review', bookModel.createReview)


router.put('/books/:bookId/review/:reviewId', bookModel.updateReviewById)


router.delete('/books/:bookId/review/:reviewId', bookModel.deleteReviewById)





















module.exports = router