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

let getAllDoctors = async () => {
    try {
        let doctors = await db.User.findAll({
            where: { roleId: 'R2' }, attributes: {
                exclude: ['image', 'password']
            }
        });
        return {
            errCode: 0,
            data: doctors
        }
    } catch (error) {
        return e
    }
}

let saveDetailInforDoctor = async (inputData) => {
    try {
        if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            await db.Markdown.create({
                contentHTML: inputData.contentHTML,
                contentMarkdown: inputData.contentMarkdown,
                description: inputData.description,
                doctorId: inputData.doctorId
            })
            return {
                errCode: 0,
                errMessage: 'Save infor doctor succeed'
            }
        }

    } catch (error) {
        return error
    }
}

let getInforDoctorById = async (inputId) => {
    try {
        if (!inputId) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            let data = await db.User.findOne({
                where: { id: inputId },
                attributes: {
                    exclude: ['password', 'image']
                },
                include: [
                    { model: db.Markdown, attributes: ['contentHTML', 'description', 'contentMarkdown'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },

                ],
                raw: true,
                nest: true
            })
            return {

                errCode: 0,
                data: data

            }
        }
    }
    catch (error) {
        return error
    }
}

module.exports = {
    getTopDoctorHome, getAllDoctors, saveDetailInforDoctor, getInforDoctorById
}