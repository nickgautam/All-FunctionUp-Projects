const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

exports.createOrder = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body
        let checkCart = await cartModel.findOne({ userId: userId })
        if (!checkCart) return res.status(404).send({ status: false, message: "No cart found" })
        if (!checkCart.items.length) return res.status(400).send({ status: false, message: "Cart is empty" })
        data.userId = userId
        data.items = checkCart.items
        data.totalPrice = checkCart.totalPrice
        data.totalItems = checkCart.totalItems
        data.totalQuantity = (checkCart.items.reduce((a, b) => b.quantity + a.quantity))

        if (data.hasOwnProperty("cancellable")) {
            if (!((data.cancellable == "true") || (data.cancellable == "false")))
                return res.status(400).send({ status: false, messsage: "cancellable should be in boolean value" })
        }

        // if (data.hasOwnProperty("status")) {
        //     if (!['pending', 'completed', 'cancled'].includes(data.status))
        //     return res.status(400).send({ status: false, messsage: "Status should be related" })
        // }    

        const OrderCreate = await orderModel.create(data)
        await cartModel.findOneAndUpdate({ _id: checkCart._id }, { $set: { items: [], totalPrice: 0, totalItems: 0 } }, { new: true })
        return res.status(200).send({ status: true, message: "Order Created Successfully", data: OrderCreate })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


exports.updateOrder = async function (req, res) {
    try {
        let userId = req.params.userId
        let data = req.body
        let { orderId, status, ...rest } = data

        if (!(Object.keys(data).length)) return res.status(400).send({ status: false, message: "req.body can't be empty" })
        if ((Object.keys(rest).length)) return res.status(400).send({ status: false, message: "invalid Attribute in req.body plz. mention orderId and Status Only" })
        if (!orderId) return res.status(400).send({ status: false, message: "Order Id is required to Update the Order" })
        if (!mongoose.Types.ObjectId.isValid(orderId)) return res.status(400).send({ status: false, message: "orderId not valid" })
        if (!status) return res.status(400).send({ status: false, message: "Status is required to Update the Order" })
        if (!(['pending', 'completed', 'cancelled'].includes(status)))
            return res.status(400).send({ status: false, message: "status should either one of this only , ['pending', 'completed', 'cancelled']" })

        let checkOrder = await orderModel.findOne({ _id: orderId })
        if (!checkOrder) return res.status(404).send({ status: false, message: "No order found" })

        if (checkOrder.status == "cancelled") return res.status(400).send({ status: false, message: "This Order is Already Cancelled" })
        if (checkOrder.status == "completed") return res.status(400).send({ status: false, message: "This Order is Already completed" })

        if (status == "cancelled" || status == "cancled") {
            if (checkOrder.cancellable != true) return res.status(400).send({ status: false, message: "You can't cancel this order" })
            checkOrder.status = "cancelled"
        }
        if (status == "completed") {
            checkOrder.status = status
        }
        if(status=="pending") return res.status(400).send({ status: false, message: "This Order is Already Pending" }) 

        let orderUpdate = await orderModel.findOneAndUpdate({ _id: orderId }, checkOrder, { new: true })
        return res.status(200).send({ status: true, message: "Order Updated Successfully", data: orderUpdate })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

