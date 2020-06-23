const express = require('express');
const app = express();
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use('/public', express.static('./public'));



const db = require('./config/database');


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.get('/', async function (req, res) {
    res.status(200)
        .send(
            "Test Success"
        );
});
app.use('/api', require('./controller/apis'));
const port = process.env.PORT || 3000;
app.listen(port, () =>
    console.log(`--------------EventCo listening on port ${port}!`))