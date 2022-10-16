const express = require('express');
const homeController = require('../controllers/homeController');


let router = express.Router();

let innitWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)
    return app.use('/', router)

};

module.exports = innitWebRoutes;