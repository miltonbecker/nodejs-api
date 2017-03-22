'use strict';

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'nodejs-api';
const serverPort = 3000;

const userAdded = 1;
const userUpdated = 2;

module.exports = { dbUrl, dbName, serverPort, userAdded, userUpdated };