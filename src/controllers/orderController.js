const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')

exports.createOrder = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body
        let checkCart = await cartModel.findOne({ userId: userId})
        if (!checkCart) return res.status(404).send({ status: false, message: "No cart found" })
        if(!checkCart.items.length) return res.status(400).send({ status: false, message: "Cart is empty" })
        data.userId = userId
        data.items = checkCart.items
        data.totalPrice = checkCart.totalPrice
        data.totalItems = checkCart.totalItems
        data.totalQuantity = (checkCart.items.reduce((a, b) => b.quantity + a.quantity))
        

    //    data.cancellable == false;

        // if (data.hasOwnProperty("cancellable")) {
        //     if (!((data.cancellable == "true") || (data.cancellable == "false")))
        //     return res.status(400).send({ status: false, messsage: "cancellable should be in boolean value" })
        // }
        // if (data.hasOwnProperty("status")) {
        //     if (!['pending', 'completed', 'cancled'].includes(data.status))
        //     return res.status(400).send({ status: false, messsage: "Status should be related" })
        // }

        const OrderCreate = await orderModel.create(data)
        await cartModel.findOneAndUpdate({ _id: checkCart._id }, { $set: { items: [], totalPrice: 0, totalItems: 0 } }, { new: true })
        return res.status(200).send({ status: true, message: "Order Created Successfully", data:OrderCreate })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// exports.updateOrder = async function(req, res){
//     try{
//         let userId = req.params.userId
//         let data = req.body
//         let checkOrder = await orderModel.findOne({ userId: userId})
//         if (!checkOrder) return res.status(404).send({ status: false, message: "No order found" })
//         if(!checkOrder.items.length) return res.status(400).send({ status: false, message: "Cart is empty" })
//     }
// }

