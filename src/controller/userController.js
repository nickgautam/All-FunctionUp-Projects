const userModel = require('../model/userModel')

const userLogin = async function (req, res) {

    const loginData = req.body

    const { email, password } = loginData


    try {
        if (Object.keys(loginData).length == 0) {
            res.status(400).send({ status: false, message: "login credentials must be presents " })
            return
        }

        if (!email) {
            res.status(400).send({ status: false, message: "email must be present " })
            return

        }

        if (!password) {
            res.status(400).send({ status: false, message: "password must be present " })
            return

        }

        const user = await userModel.findOne({ email: email, password: password })

        if (!user) {
            res.status(400).send({ status: false, message: "Make sure your login Credentials are correct or not " })
            return
        }


        const token = await jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        }, "my@third@project@book@management")

        res.header('x-api-key', token)
        res.status(200).send({ status: true, message: 'user login successfull', token: token })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
        return
    }


}

module.exports.userLogin = userLogin