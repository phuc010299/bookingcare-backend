const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');


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

    return app.use('/', router)

};

module.exports = innitWebRoutes;