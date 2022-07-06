const bookModel = require("../model/bookModel")

const createBook = async function (req, res) {
    try {
        let data = req.data
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

        if (!excerpt) {
            return res.status(400).send({
                status: false.valueOf,
                message: "excerpt is mandatory"
            })
        }

        if (!userId) {
            return res.status(400).send({
                status: false,
                message: "userId is mandatory0"
            })
        }

        if (!ISBN) {
            return res.status(400).send({
                status: false,
                message: "ISBN is mandatory"
            })
        }
        let validISBN = /[^0-9X]/
        

        if (!category) {
            return res.status(400).send({
                status: false,
                message: "category is mandatory"
            })
        }

        if (!subcategory) {
            return res.status(400).send({
                status: false,
                message: "subcategory is mandatory"
            })
        }


        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) {
            return res.status(400).send({
                status: false,
                message: "title is already present in bookModel"
            })
        }

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) {
            return res.status(400).send({
                status: false,
                message: "ISBN is already present in bookModel"
            })
        }


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

module.exports.createBook = createBook


