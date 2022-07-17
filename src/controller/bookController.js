const bookModel = require("../model/bookModel")
const validator = require('../validation/validation')
const moment = require("moment")
const reviewModel = require("../model/reviewModel")
const aws = require("../aws/aws")

//***************************************** createBook **********************************************************/


const createBook = async function (req, res) {
    try {
        console.log(req.files, req.body);
        let data = req.body
        let { title, excerpt, ISBN, category, subcategory, releasedAt} = data
        

        if (!title) {
            return res.status(400).send({
                status: false,
                message: "title is mandatory"
            })
        }

        if (!validator.isValidString(title)) {
            return res.status(400).send({
                status: false,
                message: "title should be string & can't be empty & can't have whitespace"
            })
        }

        if (!isNaN(title)) {
            return res.status(400).send({
                status: false,
                message: "title can't be a number"
            })
        }

        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) {
            return res.status(400).send({
                status: false,
                message: "title is already present in bookCollection"
            })
        }

        if (!excerpt) {
            return res.status(400).send({
                status: false,
                message: "excerpt is mandatory"
            })
        }
        if (!validator.isValidString(excerpt)) {
            return res.status(400).send({
                status: false,
                message: "excerpt should be string & can't be empty & can't have whitespace"
            })
        }

        if (!isNaN(excerpt)) {
            return res.status(400).send({
                status: false,
                message: "excerpt can't be a number"
            })
        }

        if (!ISBN) {
            return res.status(400).send({
                status: false,
                message: "ISBN is mandatory"
            })
        }
        let valid13ISBN = /^[0-9X]{13}$/   //ISBN-13       9780123456472
        let valid10ISBN = /^[0-9X]{10}$/     // ISBN-10     0123456479                                                                                     
        let valtesting = /(?=(?:[0-9]+[-]){4})[-0-9]{17}$/   //ISBN-13       978-0-123456-47-2
        let testing1 = /(?=(?:[0-9]+[-]){3})[-0-9]{13}$/   //ISBN-10       0-123456-47-9
        let testing2 = /^[0-9X ]{17}$/          //ISBN-13       978 0 123456 47 2
        let testing3 = /^[0-9X ]{13}$/     // ISBN-10     0 123456 47 9


        if (!(valid13ISBN.test(ISBN) || valid10ISBN.test(ISBN) || valtesting.test(ISBN) || testing1.test(ISBN) || testing2.test(ISBN) || testing3.test(ISBN))) {
            return res.status(400).send({
                status: false,
                message: "ISBN should be either 10 or 13 digits & format should look likes: 9780123456472 , 978-0-123456-47-2 , 978 0 123456 47 2 , 0123456479 , 0-123456-47-9 , 0 123456 47 9"
            })
        }

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) {
            return res.status(400).send({
                status: false,
                message: "ISBN is already present in bookCollection"
            })
        }

        if (!category) {
            return res.status(400).send({
                status: false,
                message: "category is mandatory"
            })
        }

        if (!validator.isValidString(category)) {
            return res.status(400).send({
                status: false,
                message: "category should be string & can't be empty"
            })
        }

        if (!isNaN(category)) {
            return res.status(400).send({
                status: false,
                message: "category can't be a number"
            })
        }

        if (!subcategory) {
            return res.status(400).send({
                status: false,
                message: "subcategory is mandatory"
            })
        }

        if (subcategory !== undefined)
            req.body.subcategory = validator.validateSubCategory(req.body.subcategory)

        if (!isNaN(subcategory)) {
            return res.status(400).send({
                status: false,
                message: "subcategory can't be a number"
            })
        }


        if (!releasedAt) {
            return res.status(400).send({
                status: false,
                message: "releasedAt is mandatory"
            })
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(releasedAt)) {
            return res.status(400).send({
                status: false,
                message: " releasedAt should be look like this: YYYY-MM-DD "
            })
        }

        let today = new Date();
        let date = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + today.getDate();


        if (!(date == releasedAt)) {
            return res.status(400).send({
                status: false,
                message: " Please enter current date with format : YYYY-MM-DD "
            })
        }
        data.releasedAt = new Date().toISOString()

        // if(req.files[0]){

        // let files = req.files

        // if (files && files.length > 0) {
        //     //upload to s3 and get the uploaded link
        //     // res.send the link back to frontend/postman
        //     var uploadedFileURL = await aws.uploadFile(files[0])
        // }
        // else {
        //     return res.status(400).send({ msg: "No file found" })
        // }

        // }

        // data.bookCover = uploadedFileURL

        await bookModel.create(data)

        let saveData = await bookModel.findOneAndUpdate({ title: title }, { $set: { deletedAt: "" } }, { new: true, upsert: true, strict: false })
        return res.status(201).send({
            status: true,
            message: "Book Created Successfully",
            data: saveData
        })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }

}


//***************************************** getBook **********************************************************/

const getBook = async function (req, res) {
    try {
        let data = req.query;
        const { userId, category, subcategory } = data;

        let filterQuery = { isDeleted: false }

        if (userId) {

            if (!validator.isValidObjectId(userId)) {
                return res.status(400).send({
                    status: false,
                    message: `userId is not valid`
                });
            }

            filterQuery["userId"] = userId
        }

        if (category) {
            filterQuery["category"] = category
        }

        if (subcategory) {

            filterQuery["subcategory"] = subcategory
        }

        let allbooks = await bookModel.find(filterQuery).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })

        if (allbooks.length == 0) return res.status(404).send({ status: false, message: "No book found" })

        return res.status(200).send({
            status: true,
            message: "Book List",
            data: allbooks
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


//***************************************** getBookById **********************************************************/

const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({
                status: false,
                message: `bookId is not valid`
            });
        }

        let allBooks = await bookModel.findById(bookId)

        if (!allBooks) {
            return res.status(404).send({
                status: false,
                message: "No book found"
            })
        }

        let allReviews = await reviewModel.find({ bookId: bookId, isDeleted: false })

        let bookWithReviews = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { reviewsData: allReviews } }, { new: true, upsert: true, strict: false })

        return res.status(200).send({
            status: true,
            message: "Book List",
            data: bookWithReviews
        })

    }
    catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

//***************************************** updateBookById **********************************************************/

const updateBookById = async function (req, res) {
    try {
        const data = req.body
        let bookId = req.params.bookId
        const { title, excerpt, ISBN } = data

        if (Object.keys(data).length == 0) {  
            return res.status(400).send({
                status: false,
                message: "request body can't be empty"
            })
        }

        let updateQuery = {}

        if (title) {

            if (!validator.isValidString(title)) {
                return res.status(400).send({
                    status: false,
                    message: "title should be string & can't be empty"
                })
            }

            if (!isNaN(title)) {
                return res.status(400).send({
                    status: false,
                    message: "title can't be a number"
                })
            }

            const checkTitle = await bookModel.findOne({ title: title })
            if (checkTitle) {
               return res.status(400).send({
                    status: false,
                    message: "book already present with this title"
                })
            }

            updateQuery["title"] = title;
        }

        if (excerpt) {
            if (!validator.isValidString(excerpt)) {
                return res.status(400).send({
                    status: false,
                    message: "excerpt should be string & can't be empty"
                })
            }

            if (!isNaN(excerpt)) {
                return res.status(400).send({
                    status: false,
                    message: "excerpt can't be a number"
                })
            }
            updateQuery["excerpt"] = excerpt
        }

        if (req.body["release date"]) {


            if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body["release date"])) {
                return res.status(400).send({
                    status: false,
                    message: " release date should be look like this: YYYY-MM-DD "
                })
            }

            let today = new Date();
            let date = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + today.getDate();




            if (!(date == req.body["release date"])) {
                return res.status(400).send({
                    status: false,
                    message: " Please enter current date with format : YYYY-MM-DD "
                })
            }

             req.body["release date"] = new Date().toISOString()



            updateQuery["releasedAt"] = req.body["release date"]
        }

        if (req.body["releasedAt"]) {

            if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body["releasedAt"])) {
                return res.status(400).send({
                    status: false,
                    message: " releasedAt should be look like this: YYYY-MM-DD "
                })
            }

            let today = new Date();
            let date = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + today.getDate();


            if (!(date == req.body["releasedAt"])) {
                return res.status(400).send({
                    status: false,
                    message: " Please enter current date with format : YYYY-MM-DD "
                })
            }

            updateQuery["releasedAt"] = new Date().toISOString
        }

        if (ISBN) {

            let valid13ISBN = /^[0-9X]{13}$/   //ISBN-13       9780123456472
            let valid10ISBN = /^[0-9X]{10}$/     // ISBN-10     0123456479                                                                                     
            let valtesting = /(?=(?:[0-9]+[-]){4})[-0-9]{17}$/   //ISBN-13       978-0-123456-47-2
            let testing1 = /(?=(?:[0-9]+[-]){3})[-0-9]{13}$/   //ISBN-10       0-123456-47-9
            let testing2 = /^[0-9X ]{17}$/          //ISBN-13       978 0 123456 47 2
            let testing3 = /^[0-9X ]{13}$/     // ISBN-10     0 123456 47 9


            if (!(valid13ISBN.test(ISBN) || valid10ISBN.test(ISBN) || valtesting.test(ISBN) || testing1.test(ISBN) || testing2.test(ISBN) || testing3.test(ISBN))) {
                return res.status(400).send({
                    status: false,
                    message: "ISBN should be either 10 or 13 digits & format should look likes: 9780123456472 , 978-0-123456-47-2 , 978 0 123456 47 2 , 0123456479 , 0-123456-47-9 , 0 123456 47 9"
                })
            }

            const checkISBN = await bookModel.findOne({ ISBN: ISBN })
            if (checkISBN) {
                 return res.status(400).send({
                    status: false,
                    message: "book already present with this ISBN"
                })
            }

            updateQuery["ISBN"] = ISBN;
        }


        const updateData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, updateQuery, { new: true })
        if (!updateData) {
            return res.status(400).send({
                status: false,
                message: " book is deleted, so you can't update"
            })
        }

        return res.status(200).send({ status: true, message: "successfully updated", data: updateData })
       

    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


//***************************************** deleteBookById **********************************************************/

const deleteBookById = async function (req, res) {

    try {
        let bookId = req.params.bookId

        let saveData = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!saveData) {
            return res.status(400).send({
                status: false,
                message: "You can't delete again, Book is already deleted"
            })
        }

        let bookForDelete = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: moment().format("YYYY-MM-DDThh:mm:ss.SSS[Z]") } }, { new: true, upsert: true, strict: false })
        console.log(bookForDelete)
        return res.status(200).send({
            status: true,
            message: "Successfully delete",
            data: bookForDelete
        })

    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


module.exports.createBook = createBook
module.exports.getBook = getBook
module.exports.getBookById = getBookById
module.exports.updateBookById = updateBookById
module.exports.deleteBookById = deleteBookById