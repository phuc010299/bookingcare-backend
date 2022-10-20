var db = require('../models/index');
var bcrypt = require('bcryptjs');
const e = require('express');

let handleUserLogin = async (email, password) => {
    try {
        let userData = {}

        let isExist = await checkUserEmail(email)

        if (isExist) {

            let user = await db.User.findOne({
                where: { email },
                attributes: ['email', 'passWord', 'roleId'], 
                raw: true
            });
            console.log(user)


            if (user) {
                // compare the password
                let check = await bcrypt.compareSync(password, user.passWord);

                if (check) {
                    userData.errCode = 0;
                    userData.errMessage = `ok`;
                    // user.passWord = undefined;
                    delete user.passWord;
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

module.exports = {
    handleUserLogin
}