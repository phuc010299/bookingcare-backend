// const { JSON } = require('sequelize');
const db = require('../models/index');
const userService = require('../services/userService');


let handleLogin = async (req, res) => {
    try {
        let userData = await userService.handleUserLogin(req.body.email, req.body.password)
        return res.status(200).json(
            userData
        )
    } catch (error) {
        return error
    }


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

    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'okay',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    try {
        let message = await userService.createNewUser(req.body)
        return res.status(200).json(message)
    } catch (error) {
        return error
    }
}

let handleEditUser = async (req, res) => {
    let data = req.body

    if (data) {
        let message = await userService.updateUserData(data);
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
            let message = await userService.deleteUser(id)
            return res.status(200).json(message)
        }
    } catch (error) {
        return error
    }

}


let getAllcode = async (req, res) => {
    try {
        let data = await userService.getAllcode(req.query.type);
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