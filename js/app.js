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
    let name = formatName(req.params.name);
    if (!name) {
        return res.sendStatus(400);
    }

    db.getUserInfo(name)
        .then(function (result) {
            if (!result) {
                res.json('{}');
                return;
            }
            res.send(result);
        }).catch(function (error) {
            res.status(500).json({ Error: error.message });
        });
});

let jsonParser = parser.json({
    verify: function (req, res, buf, enc) {
        try {
            JSON.parse(buf);
        } catch (error) {
            res.status(400).json({ Error: error.message });
            throw error;
        }
    }
});

function formatName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function nameParser(req, res, next) {
    if (!req.body || !req.body.name) {
        res.sendStatus(400);
        return false;
    }

    req.body.name = formatName(req.body.name);

    next();
}

app.post('/api/addOrUpdateUser', jsonParser, nameParser, function (req, res) {
    let body = req.body;
    db.addOrUpdateUser(body)
        .then(function (result) {
            switch (result) {
                case constants.userAdded:
                    res.json({ result: 'User added successfully' });
                    break;
                case constants.userUpdated:
                    res.json({ result: 'User updated successfully' });
                    break;
                default:
                    res.status(400).json({ result: 'User was NOT added nor updated. Please check your data and try again.' });
            }
        }).catch(function (error) {
            res.status(500).json({ Error: error.message });
        });
});

app.delete('/api/deleteUser/:name', function (req, res) {
    let name = formatName(req.params.name);
    if (!name) {
        return res.sendStatus(400);
    }

    db.deleteUser(name)
        .then(function (result) {
            if (!result) {
                res.status(400).json({ result: 'User was already gone' });
                return;
            }
            res.json({ result: 'User deleted successfully' });
        }).catch(function (error) {
            res.status(500).json({ Error: error.message });
        });
});

module.exports = app;