var db = require('../models/index');


let createClinic = async (data) => {
    try {
        if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            await db.Clinic.create({
                name: data.name,
                address: data.address,
                descriptionMarkdown: data.descriptionMarkdown,
                descriptionHTML: data.descriptionHTML,
                image: data.imageBase64
            })

            return {
                errCode: 0,
                errMessage: '0k'
            }
        }
    } catch (error) {
        return error
    }
}

let getAllClinics = async () => {
    try {

        let data = await db.Clinic.findAll()
        if (data && data.length > 0) {
            data.map(item => {
                item.image = Buffer.from(item.image, 'base64').toString('binary');
                return item
            })
        }

        return {
            errCode: 0,
            errMessage: '0k',
            data
        }


    }
    catch (error) {
        return error
    }
}

let getTopClinic = async (limitInput) => {
    try {
        if (!limitInput) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            const { count, rows } = await db.Clinic.findAndCountAll({
                limit: limitInput,
            });
            return {
                errCode: 0,
                errMessage: 'ok',
                data: rows
            }
        }

    } catch (e) {
        return e
    }
}

let getDetailClinic = async (inputId, location) => {
    try {
        if (!inputId) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {

            let data = await db.Clinic.findOne({
                where: {
                    id: inputId
                }
            })

            if (data) {
                data.image = Buffer.from(data.image, 'base64').toString('binary');
                let doctorClinic = []
                doctorClinic = await db.Doctor_infor.findAll({
                    where: { clinicId: inputId },
                    attributes: ['doctorId', 'provinceId']
                })

                data.doctorClinic = doctorClinic

            } else data = {}

            return {
                errCode: 0,
                errMessage: '0k',
                data


            }
        }



    }
    catch (error) {
        return error
    }
}


module.exports = {
    createClinic,
    getAllClinics,
    getTopClinic,
    getDetailClinic
    // getDetailClinic
}