var db = require('../models/index');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);


let createNewUser = async (data) => {
    try {
        let hashPasswordBcrypt = await hashUserPassword(data.password)
        await db.User.create({
            email: data.email,
            passWord: hashPasswordBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender === '1' ? true : false,
            roleId: data.roleId,
        })
        return('Create a new user successfully')
    } 
    
    catch (error) {
        return error
    }
};

let hashUserPassword = async (password) => {
    try {
        let hashPassword = await bcrypt.hashSync(password, salt);
        return hashPassword
    } catch (error) {
        
    }
};

let getAllUsers = async () => {
    try {
        let users = await db.User.findAll({raw: true})
        return users
    } catch (error) {
        
    }
};

let getEditUser = async (userId) => {
    try {
        let user = await db.User.findOne({where: {id: userId}, raw: true})
        return user
    } catch (error) {
        
    }
};
let updateUser = async (data) => {
    try {
        
        let user = await db.User.findOne({where: {id: data.id}})
        if (user) {
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.email = data.email;
            user.address = data.address;

            await user.save();
        }

        let allUsers = await db.User.findAll()
        return allUsers
    } catch (error) {
        
    }
};

let deleteUser = async (userId) => {
    try {
        let user = await db.User.findOne({where: {id: userId}})
        if (user) {
            await user.destroy();
            return ;
        }
    } catch (error) {
        
    }
};


module.exports = {
    createNewUser, getAllUsers,getEditUser, updateUser, deleteUser
}