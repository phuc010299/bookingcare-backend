// const { JSON } = require('sequelize');
const db = require('../models/index');
const doctorService = require('../services/doctorService');



let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) { limit = 10 }
    try {
        //  convert string to number by "+"
        let response = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(response);

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            data: 'Error from server'
        })

    }
}

module.exports = {
    getTopDoctorHome
}