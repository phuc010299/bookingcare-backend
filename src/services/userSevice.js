var db = require('../models/index');
var bcrypt = require('bcryptjs');
const express = require('express');
var salt = bcrypt.genSaltSync(10);

let handleUserLogin = async (email, password) => {
    try {
        let userData = {}
        let isExist = await checkUserEmail(email)
        if (isExist) {
            let user = await db.User.findOne({
                where: { email },
                attributes: ['email', 'password', 'roleId', 'firstName', 'lastName'],
                raw: true
            });


            if (user) {
                // compare the password
                let check = await bcrypt.compareSync(password, user.password);

                if (check) {
                    userData.errCode = 0;
                    userData.errMessage = `ok`;
                    // user.passWord = undefined;
                    delete user.password;
                    userData.user = user
                } else {
                    userData.errCode = 3;
                    userData.errMessage = `Wrong password`
                }
            } else {
                userData.errCode = 2;
                userData.errMessage = `User's not found`
            }
        } else {
            userData.errCode = 1;
            userData.errMessage = `You's Email isn't exist in your system. Please try other email addresses`
        }
        return userData

    } catch (error) {
        return
    }

}


let checkUserEmail = async (userEmail) => {
    try {
        let user = await db.User.findOne({
            where: { email: userEmail }
        })

        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return error
    }
}

let hashUserPassword = async (password) => {
    try {
        let hashPassword = await bcrypt.hashSync(password, salt);
        return hashPassword
    } catch (error) {

    }
};


let getAllUsers = async (userId) => {
    try {
        let users = '';
        if (userId == 'All') {
            users = await db.User.findAll({
                attributes: {
                    exclude: ['password']
                }
            })
        } if (userId && userId !== 'All') {
            users = await db.User.findOne({
                where: { id: userId }, attributes: {
                    exclude: ['password']
                }
            })

            console.log(users)
        }
        return users
    } catch (error) {
        return error
    }
}


let createNewUser = async (data) => {
    try {
        // check email is exist
        let check = await checkUserEmail(data.email);
        if (check) {
            return {
                errCode: 1,
                errMessage: 'Your email is already in use. Please try again'
            }
        }
        let hashPasswordBcrypt = await hashUserPassword(data.password)
        await db.User.create({
            email: data.email,
            password: hashPasswordBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            roleId: data.roleId,
            positionId: data.positionId,
            image: data.avatar

        })
        return {
            errCode: 0,
            message: 'ok'
        }
    }

    catch (error) {
        return error
    }
};

let deleteUser = async (userId) => {
    try {
        let user = await db.User.findOne({ where: { id: userId } });

        if (!user) {
            return {
                errCode: 2,
                message: 'user not found'
            }
        }

        await db.User.destroy({
            where: { id: userId }
        })

        return {
            errCode: 0,
            message: 'delete user successfully'
        }
    } catch (error) {
        return error
    }
}

let updateUserData = async (data) => {
    try {

        if (!data.id || !data.gender || !data.roleId || !data.positionId) {
            return {
                errCode: 1,
                message: 'Missing required id parameter'
            }
        }
        let user = await db.User.findOne({ where: { id: data.id }, raw: false })
        if (user) {
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.address = data.address;
            user.phoneNumber = data.phoneNumber;
            user.gender = data.gender;
            user.roleId = data.roleId;
            user.positionId = data.positionId;
            if (data.avatar) {
                user.image = data.avatar;
            }



            await user.save();
            return {
                errCode: 0,
                message: 'Update user successfully'
            }
        } else {
            return {
                errCode: 2,
                message: 'User not found'
            }
        }

    } catch (error) {

    }
}

let getAllcode = async (typeInput) => {
    try {
        if (!typeInput) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters'
            }
        } else {
            let res = {}
            let allcode = await db.Allcode.findAll({
                where: { type: typeInput }
            });
            res.errCode = 0;
            res.data = allcode;
            return res
        }

    } catch (error) {
        return error
    }
}


module.exports = {
    handleUserLogin, getAllUsers, createNewUser, deleteUser, updateUserData, getAllcode
}