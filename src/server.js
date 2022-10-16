const express = require('express');
const bodyParser = require('body-parser'); 
const viewEngine = require('./config/viewEngine'); 
const innitWebRoutes = require('./route/web');
const dotenv = require('dotenv');

dotenv.config();


let app = express();

// config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
innitWebRoutes(app);

let port = process.env.PORT || 3000;
//Port ===undefined => port = 3000

app.listen(port, () => {
    console.log('Backend listening on http://localhost:' + port);
});