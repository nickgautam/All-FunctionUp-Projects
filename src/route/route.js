const express = require('express')
const userController = require('../controller/userController')
const bookController = require('../controller/bookController')
const router = express.Router()


// router.post('/register', userController.createUser)

router.post('/login', userController.userLogin)

// router.post('/books', bookController.createBook)

// router.get('/books', bookController.getBook)

// router.get('/books/:bookId', bookController.getBookById)

// router.put('/books/:bookId', bookController.updateBookById)

// router.delete('/books/:bookId', bookController.deleteBookById)


// router.post('/books/:bookId/review', bookController.createReview)


// router.put('/books/:bookId/review/:reviewId', bookController.updateReviewById)


// router.delete('/books/:bookId/review/:reviewId', bookController.deleteReviewById)





















module.exports = router