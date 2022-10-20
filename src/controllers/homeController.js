// const { JSON } = require('sequelize');
const db = require('../models/index');
const CRUDSevice = require('../services/CRUDSevice');


let getHomePage = async (req, res, next) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs',{
            data: JSON.stringify(data),
        })
        
    } catch (error) {
    }
}

let getCrud = async (req, res, next) => {
    try {
         res.render('crud.ejs')
        
    } catch (error) {
    }
}

let postCrud = async (req, res, next) => {
    try {
        const message = await CRUDSevice.createNewUser(req.body)
        res.redirect('back');
        
    } catch (error) {
    }
}

let displayGetCrud = async (req, res, next) => {
    try {
        let data = await CRUDSevice.getAllUsers()
        return res.render('displayCrud', {
            dataTable: data
        })
        
    } catch (error) {
    }
}

let getEditCrud = async (req, res, next) => {
    try {
        let userId = await req.query.id
        if (userId) {
            let userData = await CRUDSevice.getEditUser(userId)
            return res.render('editCrud', {
                userData
            })
        } else {
            return res.send('User not found')
        }
    } catch (error) {
    }
}

let putCrud = async (req, res, next) => {
    try {
        let data = await req.body
        let allUsers = await CRUDSevice.updateUser(data)

        return res.render('displayCrud', {
            dataTable: allUsers
        })
       
    } catch (error) {
    }
}

let deleteCrud = async (req, res, next) => {
    let id = await req.query.id
    await CRUDSevice.deleteUser(id)
    return res.send('delete successfully')
}
module.exports = {
    getHomePage, getCrud, postCrud, displayGetCrud, getEditCrud, putCrud, deleteCrud
}