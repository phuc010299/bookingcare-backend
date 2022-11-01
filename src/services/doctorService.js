var db = require('../models/index');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

let getTopDoctorHome = async (limitInput) => {
    try {
        let users = await db.User.findAll({
            limit: limitInput,
            where: { roleId: 'R2' },
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['password']
            },
            include: [
                { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }

            ],
            raw: true,
            nest: true
        })

        return {
            errCode: 0,
            data: users
        }

    } catch (e) {

        return e

    }
}

module.exports = {
    getTopDoctorHome
}