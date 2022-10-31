const express = require('express');
const bodyParser = require('body-parser');
const viewEngine = require('./config/viewEngine');
const innitWebRoutes = require('./route/web');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');
var methodOverride = require('method-override');
var cors = require('cors')

dotenv.config();


let app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// config app
// app.use(cors({ origin: true }))
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(methodOverride('_method'))

viewEngine(app);
innitWebRoutes(app);

connectDB();

let port = process.env.PORT || 3000;
//Port ===undefined => port = 3000

app.listen(port, () => {
    console.log('Backend listening on http://localhost:' + port);
});