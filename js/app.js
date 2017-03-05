'use strict';
let express = require('express');
let path = require('path');
let db = require('./db');
let parser = require('body-parser');
let constants = require('./constants');

let app = express();

app.get('/', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../index.html`));
});

app.use('/node_modules', express.static(path.resolve(`${__dirname}/../node_modules`)));

let jsonParser = parser.json({
    verify: function (req, res, buf, enc) {
        res.set('Content-Type', 'application/json');
        try {
            JSON.parse(buf);
        } catch (error) {
            res.status(400).send(JSON.stringify({ Error: error.message }));
            throw Error(error);
        }
    }
});

app.post('/api/getUserInfo', jsonParser, function (req, res) {
    let body = req.body;
    if (!body) {
        return res.sendStatus(400);
    }

    db.getUserInfo(body.name)
        .then(function (result) {
            if (!result) {
                res.send('{}');
                return;
            }
            res.send(result);
        }).catch(function (error) {
            res.status(500).send(JSON.stringify({ Error: error.message }));
        });
});

app.listen(constants.serverPort, function () {
    console.log('Listening on port %d...', constants.serverPort);
});

// / = index.html with some doc
// /api/service = REST Web service, receives a JSON and returns a JSON
