const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const doctorController = require('../controllers/doctorController');


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






    return app.use('/', router)

};

module.exports = innitWebRoutes;