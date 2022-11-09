
const db = require('../models/index');
const specialtyService = require('../services/specialtyService')

let createSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.createSpecialty(req.body)
        return res.status(200).json(infor)

    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })

    }
}


module.exports = {
    createSpecialty,
}