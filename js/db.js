'use strict';
let dbClient = require('mongodb');
let constants = require('./constants');

let getUserInfo = function (userName) {
    let promise = dbClient.connect(`${constants.dbUrl}/${constants.dbName}`)
        .then(function (db) {
            let doc = db.collection('users').findOne({ name: userName }, { fields: { _id: false } });
            db.close();
            return doc;
        }).then(function (doc) {
            return doc;
        }).catch(function (error) {
            throw error;
        });
    return promise;
}

let addOrUpdateUser = function (object) {
    let promise = dbClient.connect(`${constants.dbUrl}/${constants.dbName}`)
        .then(function (db) {
            let op = db.collection('users').updateOne(
                { name: object.name },
                { $set: object },
                { upsert: true }
            );
            db.close();
            return op;
        }).then(function (op) {
            if (op.upsertedCount) {
                return constants.userAdded;
            }
            if (op.matchedCount) {
                return constants.userUpdated;
            }
            return 0;
        }).catch(function (error) {
            throw error;
        });
    return promise;
}

let deleteUser = function (name) {
    let promise = dbClient.connect(`${constants.dbUrl}/${constants.dbName}`)
        .then(function (db) {
            let op = db.collection('users').deleteOne({ name: name });
            db.close();
            return op;
        }).then(function (op) {
            return op.deletedCount;
        }).catch(function (error) {
            throw error;
        });
    return promise;
}

module.exports = { getUserInfo, addOrUpdateUser, deleteUser };