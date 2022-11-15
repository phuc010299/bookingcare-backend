const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const doctorController = require('../controllers/doctorController');
const patientController = require('../controllers/patientController');
const specialtyController = require('../controllers/specialtyController');
const clinicController = require('../controllers/clinicController');


let router = express.Router();

let innitWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCrud)
    router.post('/post-crud', homeController.postCrud)
    router.put('/put-crud', homeController.putCrud)
    router.get('/delete-crud', homeController.deleteCrud)
    router.get('/get-crud', homeController.displayGetCrud)
    router.get('/edit-crud', homeController.getEditCrud)

    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/allcode', userController.getAllcode)

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    router.post('/api/save-infor-doctors', doctorController.postInforDoctors)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)

    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)
    router.post('/api/send-remedy', doctorController.sendRemedy)


    router.post('/api/patient-book-appointment', patientController.postBookAppointment)
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment)


    router.post('/api/create-new-specialty', specialtyController.createSpecialty)
    router.get('/api/get-all-specialties', specialtyController.getAllSpecialties)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialty)

    router.post('/api/create-new-clinic', clinicController.createClinic)
    router.get('/api/get-all-clinic', clinicController.getAllClinics)
    router.get('/api/get-top-clinic', clinicController.getTopClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinic)

    // router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinic)






    return app.use('/', router)

};

module.exports = innitWebRoutes;