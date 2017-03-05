'use strict';
let dbClient = require('mongodb');
let constants = require('./constants');

let getUserInfo = function (userName) {
    let promise = dbClient.connect(`${constants.dbUrl}/${constants.dbName}`)
        .then(function (db) {
            let doc = db.collection('users').findOne({ name: userName }, {fields: {_id: false}});
            db.close();
            return doc;
        }).then(function (doc) {
            if (!doc) {
                return 0;
            } else {
                return doc;
            }
        }).catch(function (error) {
            throw error;
        });
    return promise;
}

module.exports = { getUserInfo };