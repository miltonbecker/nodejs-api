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

app.get('/api/getUserInfo/:name', function (req, res) {
    res.set('Content-Type', 'application/json');

    let name = req.params.name;
    if (!name) {
        return res.sendStatus(400);
    }

    db.getUserInfo(name)
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

app.post('/api/addOrUpdateUser', jsonParser, function (req, res) {
    let body = req.body;
    if (!body || !body.name) {
        return res.sendStatus(400);
    }

    db.addOrUpdateUser(body)
        .then(function (result) {
            switch (result) {
                case constants.userAdded:
                    res.send(JSON.stringify({ result: 'User added successfully' }));
                    break;
                case constants.userUpdated:
                    res.send(JSON.stringify({ result: 'User updated successfully' }));
                    break;
                default:
                    res.status(400).send(JSON.stringify({ result: 'User was NOT added nor updated. Please check your data and try again.' }));
            }
        }).catch(function (error) {
            res.status(500).send(JSON.stringify({ Error: error.message }));
        });
});

app.delete('/api/deleteUser/:name', function (req, res) {
    res.set('Content-Type', 'application/json');

    let name = req.params.name;
    if (!name) {
        return res.sendStatus(400);
    }

    db.deleteUser(name)
        .then(function (result) {
            if (!result) {
                res.status(400).send(JSON.stringify({ result: 'User was already gone' }));
                return;
            }
            res.send(JSON.stringify({ result: 'User deleted successfully' }));
        }).catch(function (error) {
            res.status(500).send(JSON.stringify({ Error: error.message }));
        });
});

app.listen(constants.serverPort, function () {
    console.log('Listening on port %d...', constants.serverPort);
});
