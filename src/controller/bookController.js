const { default: mongoose } = require("mongoose")
const bookModel = require("../model/bookModel")
const valid = require('../validation/validation')
const moment = require("moment")

const isValidBody = function (value) {
    if (Object.keys(value).length == 0) return false
    return true
}


function isNum(val) {
    return !isNaN(val)
}


const isValidString = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true;
}

const validateSubCategory = (subcategory) => {
    if (!Array.isArray(subcategory)) {
        return subcategory.replace("[", "").replace("]", "").replace("{", "").replace("}", "").trim().split(",").filter((subcategory) => {
            return subcategory !== ""
        })
    }
    return subcategory
}

//***************************************** createBook **********************************************************/


const createBook = async function (req, res) {
    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                message: "please provide input"
            })
        }

        if (!title) {
            return res.status(400).send({
                status: false,
                message: "title is mandatory"
            })
        }
        if (!isValidString(title)) {
            return res.status(400).send({
                status: false,
                message: "title should be string & can't be empty"
            })
        }
        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) {
            return res.status(400).send({
                status: false,
                message: "title is already present in bookModel"
            })
        }

        if (!excerpt) {
            return res.status(400).send({
                status: false.valueOf,
                message: "excerpt is mandatory"
            })
        }
        if (!isValidString(excerpt)) {
            return res.status(400).send({
                status: false,
                message: "excerpt should be string & can't be empty"
            })
        }

        if (!userId) {
            return res.status(400).send({
                status: false,
                message: "userId is mandatory"
            })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({
                status: false,
                message: "userId is invalid"
            })
        }

        if (!ISBN) {
            return res.status(400).send({
                status: false,
                message: "ISBN is mandatory"
            })
        }
        let validISBN = /^[0-9]{3}\-[0-9]{1}\-[0-9]{6}\-[0-9]{2}\-[0-9]{1}$/


        // /^(?=.*[0-9])(?=.*[-])[0-9-]{1,13}$/
        //  /^(?=.*[0-9]{13})(?=.*[-]{4})$/
        // /^(?:[0-9]{9}X|[0-9]{10})$/;
        // /^[0-9X]$/
        // ^[\d*\-]{10}|[\d*\-]{13}$
        // ISBN-10     0-123456-47-9
        //ISBN-13       978-0-123456-47-2

        if (!validISBN.test(ISBN)) {
            return res.status(400).send({
                status: false,
                message: "ISBN should be 13 digits & format should look like:  978-0-123456-47-2"
            })
        }


        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) {
            return res.status(400).send({
                status: false,
                message: "ISBN is already present in bookModel"
            })
        }

        if (!category) {
            return res.status(400).send({
                status: false,
                message: "category is mandatory"
            })
        }
        if (!isValidString(category)) {
            return res.status(400).send({
                status: false,
                message: "category should be string & can't be empty"
            })
        }
        if (isNum(category) == true) {
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

        if (req.body.subcategory !== undefined)
            req.body.subcategory = validateSubCategory(req.body.subcategory)
        // if(subcategory.length==0){
        //     return res.status(400).send({
        //         status: false,
        //         message: "subcategory should not be empty"
        //     })
        // }

        data.releasedAt = moment().format("YYYY-MM-DDThh:mm:ss.SSS[Z]")


        let saveData = await bookModel.create(data)
        return res.status(201).send({
            status: true,
            message: "Success",
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



//***************************************** createBook **********************************************************/


const updateBookById = async function (req, res) {

    try {

        const data = req.body
        const id = req.params
        let bookId = req.params.bookId

        const { title, excerpt, releaseAt, ISBN } = data


        console.log(bookId);
        console.log(title);

        if (!isValidBody(data)) {
            res.status(400).send({
                status: false,
                message: "All feild can't be empty"
            })
        }

        // if (bookId.length < 24) {
        //     res.status(400).send({
        //         status: false,
        //         message: "make sure your bookId is correct or not "
        //     })
        // }

        console.log(id);


        const checkBookId = await bookModel.findById({ bookId })
        if (!checkBookId) {
            res.status(404).send({
                status: false,
                message: "Sorry! No Book found "
            })
        }



        if (title) {
            const checkTitle = await bookModel.findOne({ title: title })
            if (checkTitle) {
                res.status(400).send({
                    status: false,
                    message: "book already present with this title"
                })
            }
        }

        if (ISBN) {
            const checkISBN = await bookModel.findOne({ ISBN: ISBN })
            if (checkISBN) {
                res.status(400).send({
                    status: false,
                    message: "book already present with this ISBN"
                })
            }
        }


        const updateData = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            { $set: data },
            { new: true })
        console.log(updateData);
        res.status(200).send({ status: true, message: "success", data: updateData })
        return


    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}










module.exports.createBook = createBook
module.exports.updateBookById = updateBookById




