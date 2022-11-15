var db = require('../models/index');


let createSpecialty = async (data) => {
    try {
        if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            await db.Specialty.create({
                name: data.name,
                image: data.imageBase64,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown
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

let getAllSpecialties = async () => {
    try {

        let data = await db.Specialty.findAll()
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

let getDetailSpecialty = async (inputId, location) => {
    try {
        if (!inputId || !location) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {

            let data = await db.Specialty.findOne({
                where: {
                    id: inputId
                }
            })

            if (data) {
                data.image = Buffer.from(data.image, 'base64').toString('binary');
                let doctorSpecialty = []
                if (location === "ALL") {
                    //  Find  ALL
                    doctorSpecialty = await db.Doctor_infor.findAll({
                        where: { specialtyId: inputId },
                        attributes: ['doctorId', 'provinceId']
                    })
                } else {
                    //  Find by location
                    doctorSpecialty = await db.Doctor_infor.findAll({
                        where: {
                            specialtyId: inputId,
                            provinceId: location
                        },
                        attributes: ['doctorId', 'provinceId']
                    })
                }
                data.doctorSpecialty = doctorSpecialty

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
    createSpecialty,
    getAllSpecialties,
    getDetailSpecialty
}