// const { JSON } = require('sequelize');
const db = require('../models/index');
const userSevice = require('../services/userSevice');


let handleLogin = async (req, res) => {

    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter'
        })
    }
    let userData = await userSevice.handleUserLogin(email, password)
    // check email exist
    // compare password
    // return userInfo
    // access token: JWT Json Web Token

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {'a': 'a'}
    })
}
module.exports = {
    handleLogin,
}