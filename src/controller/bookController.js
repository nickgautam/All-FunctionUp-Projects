const { default: mongoose } = require("mongoose")
const bookModel = require("../model/bookModel")
const valid = require('../validation/validation')
const moment = require("moment")

function isNum(val) {
    return !isNaN(val)
}

const isValidString = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value !== "string" || value.trim().length === 0) return false //""
    return true;
}

const validateSubCategory = (subcategory) => {
    if (!Array.isArray(subcategory)) {
        return subcategory.replace("[", "").replace("]", "").replace("{", "").replace("}", "").trim().split(",").filter((subcategory) => {
            return subcategory !== ""
        })
    }
    return subcategory.join(",").replace("[", "").replace("]", "").replace("{", "").replace("}", "").trim().split(",").filter((subcategory) => {
        return subcategory !== ""
    })
}
     
//---------------------- create book ------------------------

const createBook = async function (req, res) {
    try {
        let data = req.body      
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data       

        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                message: "please provide input in request body"
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
                status: false,
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
        let valid13ISBN =   /^[0-9X]{13}$/   //ISBN-13       9780123456472
        let valid10ISBN =   /^[0-9X]{10}$/     // ISBN-10     0123456479                                                                                     
        let valtesting =      /(?=(?:[0-9]+[-]){4})[-0-9]{17}$/   //ISBN-13       978-0-123456-47-2
        let testing1 =      /(?=(?:[0-9]+[-]){3})[-0-9]{13}$/   //ISBN-10       0-123456-47-9
        let testing2 = /^[0-9X ]{17}$/          //ISBN-13       978 0 123456 47 2
        let testing3= /^[0-9X ]{13}$/     // ISBN-10     0 123456 47 9
      

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

        if (subcategory !== undefined)
            req.body.subcategory = validateSubCategory(req.body.subcategory)

            if (!releasedAt) {
                return res.status(400).send({
                    status: false,
                    message: "releasedAt is mandatory"
                })
            }
            if (!isValidString(releasedAt)) {
                return res.status(400).send({
                    status: false,
                    message: "releasedAt should be a date like '2022-07-14' & can't be empty"
                })
            }
       // A problem we have to handle how we can check the type is date or not.
        // data.releasedAt = moment().format("YYYY-MM-DD")
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


//***************************************** getBook **********************************************************/

const getBook = async function (req, res) {
    try {
        let data = req.query;
        const { userId, category, subcategory } = data;

        let filterQuery = { isDeleted: false }

       
        if (userId) {
        //  if(!isValidString(userId)) return res.status(400).send({status: false, message: "userId can't be empty"})
            let regex = /^[0-9a-f]{24}$/;    
            if (!regex.test(userId)) 
               return res.status(400).send({ status: false, message: `userId is not valid` });

            filterQuery["userId"] = userId
        }

        if (category) {
            // if(!isValidString(category)) return res.status(400).send({status: false, message: "category can't be empty"})
            filterQuery["category"] = category
        }

        if (subcategory) {
            filterQuery["subcategory"] = subcategory
        }

       
        let allbooks = await bookModel.find(filterQuery).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1}).sort({title: 1})  //<---------<
        console.log(allbooks)
        if (allbooks.length == 0) return res.status(404).send({ status: false, message: "No book found" })

        res.status(200).send({ status: true, message: "Book List", data: allbooks })
    
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


//***************************************** getBookById **********************************************************/


const getBookById = async function (req, res){
    try{
        let bookId = req.params.bookId
        let regex = /^[0-9a-f]{24}$/;    
        if (!regex.test(bookId)) 
           return res.status(400).send({ status: false, message: `bookId is not valid` });
        let allBooks = await bookModel.findById(bookId)
        if(!allBooks){
            return res.status(404).send({
                status: false,
                message: "No book found"
            })
        }
        return res.status(200).send({
            status: true,   
            message : "Book List",    
            data: allBooks
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


//***************************************** updateBookById **********************************************************/


const updateBookById = async function (req, res) {
    try {
        const data = req.body
        let bookId = req.params.bookId
        const { title, excerpt, ISBN } = data
         
        let updateQuery= {}
         
        if(title){
            updateQuery["title"]= title;

            const checkTitle = await bookModel.findOne({ title: title })
            if (checkTitle) {
                res.status(400).send({
                    status: false,
                    message: "book already present with this title"
                })
            }
        }

        if(excerpt){
            updateQuery["excerpt"]= excerpt
        }
        
        if(req.body["release date"]){
            updateQuery["releasedAt"]= req.body["release date"]
        }

        if(req.body["releasedAt"]){
            updateQuery["releasedAt"]= req.body["releasedAt"]
        }

        if(ISBN){
            updateQuery["ISBN"]= ISBN;

            const checkISBN = await bookModel.findOne({ ISBN: ISBN })
            if (checkISBN) {
                res.status(400).send({                         
                    status: false,
                    message: "book already present with this ISBN"    
                })
            }
        }

        console.log(updateQuery)

        if (Object.keys(data).length == 0) {
            res.status(400).send({
                status: false,
                message: "request body can't be empty"
            })
        }

        const updateData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, updateQuery, { new: true })
        if(!updateData){
            return res.status(404).send({
                status: false,
                message: "Either book is not exist with this bookId or book is deleted, so you can't update"
            })
        }

        res.status(200).send({ status: true, message: "success", data: updateData })
        return

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
module.exports.getBook = getBook
module.exports.getBookById = getBookById
module.exports.updateBookById = updateBookById
