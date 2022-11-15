var db = require('../models/index');
require('dotenv').config();
var _ = require('lodash');
const { reduce } = require('lodash');
const emailService = require('./emailService')
const { v4: uuidv4 } = require('uuid');



let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}


let postBookAppointment = async (data) => {
    try {
        if (!data.email || !data.doctorId || !data.date || !data.timeType
            || !data.fullName || !data.selectedGender || !data.address) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            console.log('check before')

            let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
            await emailService.sendSimpleEmail({
                receiverEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildUrlEmail(data.doctorId, token)
            })


            let user = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3',
                    firstName: data.fullName,
                    gender: data.selectedGender,
                    address: data.address
                }
            })

            console.log('check after')

            if (user && user[0]) {
                await db.Booking.findOrCreate({
                    where: { patientId: user[0].id },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token
                    }
                })
            }
            return {
                errCode: 0,
                errMessage: 'Save infor patient succeed'
            }
        }


    } catch (error) {

    }
}


let postVerifyBookAppointment = async (data) => {
    try {
        if (!data.token || !data.doctorId) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            let appointment = await db.Booking.findOne({
                where: {
                    doctorId: data.doctorId,
                    token: data.token,
                    statusId: 'S1'
                },
                raw: false
            })

            if (appointment) {
                appointment.statusId = 'S2'
                await appointment.save()
                return {
                    errCode: 0,
                    errMessage: 'Update appointment succeed'
                }
            } else {
                return {
                    errCode: 2,
                    errCodeMessage: 'Appointment has been activated or does not exist'
                }
            }
        }
    } catch (error) {

    }
}


module.exports = {
    postBookAppointment,
    postVerifyBookAppointment
}