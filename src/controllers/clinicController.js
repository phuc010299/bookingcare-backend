
const db = require('../models/index');
const clinicService = require('../services/clinicService');



let createClinic = async (req, res) => {
    try {
        let infor = await clinicService.createClinic(req.body)
        return res.status(200).json(infor)

    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })

    }
}

let getAllClinics = async (req, res) => {
    try {
        let infor = await clinicService.getAllClinics()
        return res.status(200).json(infor)

    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })

    }
}

let getTopClinic = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) { limit = 10 }
    try {
        let response = await clinicService.getTopClinic(+limit)
        return res.status(200).json(response);

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            data: 'Error from server'
        })

    }
}



let getDetailClinic = async (req, res) => {
    try {
        let infor = await clinicService.getDetailClinic(req.query.id)
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
    createClinic, getAllClinics,
    getTopClinic,
    getDetailClinic
}