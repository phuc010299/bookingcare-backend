var db = require('../models/index');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
require('dotenv').config();
var _ = require('lodash');
const { reduce } = require('lodash');

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;


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
        if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.description
            || !inputData.action || !inputData.selectPrice || !inputData.selectPayment || !inputData.selectProvince
            || !inputData.nameClinic || !inputData.addressClinic || !inputData.note) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            // upsert to Markdown
            if (inputData.action === 'CREATE') {

                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })

            } else {
                if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save()
                    }
                }
            }

            // upsert to Doctor_infor table

            let doctorInfor = await db.Doctor_infor.findOne({
                where: { doctorId: inputData.doctorId },
                raw: false
            })
            console.log('check doctorInfor', doctorInfor)
            if (doctorInfor) {
                doctorInfor.priceId = inputData.selectPrice;
                doctorInfor.paymentId = inputData.selectPayment;
                doctorInfor.provinceId = inputData.selectProvince;
                doctorInfor.nameClinic = inputData.nameClinic;
                doctorInfor.addressClinic = inputData.addressClinic;
                doctorInfor.note = inputData.note;
                await doctorInfor.save()

            } else {
                await db.Doctor_infor.create({
                    doctorId: inputData.doctorId,
                    priceId: inputData.selectPrice,
                    paymentId: inputData.selectPayment,
                    provinceId: inputData.selectProvince,
                    nameClinic: inputData.nameClinic,
                    addressClinic: inputData.addressClinic,
                    note: inputData.note,
                })

            }
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
                    exclude: ['password']
                },
                include: [
                    { model: db.Markdown, attributes: ['contentHTML', 'description', 'contentMarkdown'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_infor,
                        attributes: { exclude: ['doctorId', 'id'] },
                        include: [
                            { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        ]
                    },


                ],
                raw: false,
                nest: true
            })
            if (data && data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary');

            }
            if (!data) data = {}
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

let bulkCreateSchedule = async (data) => {
    try {
        console.log('check data', data)
        if (!data.arrSchedule || !data.doctorId || !data.date) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            let schedule = data.arrSchedule
            if (schedule && schedule.length > 0) {
                schedule.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE
                    return item
                })
            }
            // get all existing
            let existing = await db.Schedule.findAll({
                where: { doctorId: data.doctorId, date: data.date },
                attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                raw: true
            })

            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && a.date === +b.date
            })

            console.log('check  schedule', schedule)
            console.log('check existing', existing)
            console.log('check to create', toCreate)


            if (toCreate && toCreate.length > 0) {
                await db.Schedule.bulkCreate(toCreate)
                return {
                    errCode: 0,
                    errMessage: 'Save schedule doctor succeed'
                }
            } else {
                return {
                    errCode: 1,
                    errMessage: 'Save schedule doctor fail'
                }
            }
        }

    } catch (error) {
        return error

    }
}

let getScheduleByDate = async (doctorId, date) => {
    try {
        if (!doctorId || !date) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            let data = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },

                ],
                raw: false,
                nest: true
            })
            if (!data) data = []

            return {
                errCode: 0,
                data: data
            }
        }
        // console.log('check bulkCreateSchedule', typeof schedule)

    } catch (error) {
        return error
    }
}
let getExtraInforDoctorById = async (doctorId) => {
    try {
        if (!doctorId) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            let data = await db.Doctor_infor.findOne({
                where: {
                    doctorId: doctorId,
                },
                attributes: { exclude: ['doctorId', 'id'] },
                include: [
                    { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                ]
                ,
                raw: false,
                nest: true
            })
            if (!data) data = []

            return {
                errCode: 0,
                data: data
            }
        }
        // console.log('check bulkCreateSchedule', typeof schedule)

    } catch (error) {
        return error
    }
}

let getProfileDoctorById = async (inputId) => {
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
                    exclude: ['password']
                },
                include: [
                    { model: db.Markdown, attributes: ['contentHTML', 'description', 'contentMarkdown'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_infor,
                        attributes: { exclude: ['doctorId', 'id'] },
                        include: [
                            { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        ]
                    },


                ],
                raw: false,
                nest: true
            })
            if (data && data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary');

            }
            if (!data) data = {}
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
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInforDoctor,
    getInforDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById
}