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
        user: userData.user ? userData.user : { 'a': 'a' }
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id

    if (!id) {
        return res.status(200).json({
            errcode: 1,
            errMessage: 'Missing required parameters',
            users: []
        })
    }

    let users = await userSevice.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'okay',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    try {
        let message = await userSevice.createNewUser(req.body)
        return res.status(200).json(message)
    } catch (error) {
        return error
    }
}

let handleEditUser = async (req, res) => {
    let data = req.body

    if (data) {
        let message = await userSevice.updateUserData(data);
        return res.status(200).json(message)
    } else {
        return {
            errCode: 1,
            message: 'Missing required fields'
        }
    }

}




let handleDeleteUser = async (req, res) => {
    try {
        let id = await req.body.id
        if (id) {
            let message = await userSevice.deleteUser(id)
            return res.status(200).json(message)
        }
    } catch (error) {
        return error
    }

}


let getAllcode = async (req, res) => {
    try {
        let data = await userSevice.getAllcode(req.query.type);
        return res.status(200).json(data)
    } catch (error) {
        console.log('Get all code error:', error)

        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })

    }
}
module.exports = {
    handleLogin, handleGetAllUsers, handleCreateNewUser, handleEditUser, handleDeleteUser, getAllcode
}