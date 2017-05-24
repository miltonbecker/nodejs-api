'use strict';
let request = require('supertest');
let app = require('./../js/app');

const testUser = { name: 'Test', age: 40 };

describe('Add/update user info', function () {
    const route = '/api/addOrUpdateUser';

    it('Returns http code 200', function (done) {
        request(app)
            .post(route)
            .send(testUser)
            .expect(200)
            .expect(/successfully/i, done);
    });

    it('Returns JSON saying it completed successfully', function (done) {
        request(app)
            .post(route)
            .send(testUser)
            .expect('Content-Type', /json/)
            .expect(/successfully/i, done);
    });

    it('Validates it is in JSON format', function (done) {
        request(app)
            .post(route)
            .send('name: test')
            .expect(400, done);
    });

    it('Validates there is a name', function (done) {
        request(app)
            .post(route)
            .send({ age: 28 })
            .expect(400, done);
    });
});

describe('Get user info', function () {
    const route = `/api/getUserInfo/${testUser.name}`;
    const lowerCaseRoute = '/api/getUserInfo/test';
    const crazyCaseRoute = '/api/getUserInfo/tEsT';

    it('Returns http code 200', function (done) {
        request(app)
            .get(route)
            .expect(200, done);
    });

    it('Returns JSON', function (done) {
        request(app)
            .get(route)
            .expect('Content-Type', /json/, done);
    });

    it('Returns all user info', function (done) {
        request(app)
            .get(route)
            .expect(testUser, done);
    });

    it('Ignores lower case name', function (done) {
        request(app)
            .get(lowerCaseRoute)
            .expect(testUser, done);
    });

    it('Ignores crazy case name', function (done) {
        request(app)
            .get(crazyCaseRoute)
            .expect(testUser, done);
    });
});

describe('Delete user info', function () {
    const route = `/api/deleteUser/${testUser.name}`;

    describe('When deleting existing user', function () {
        it('Returns http code 200 and JSON saying it was successful', function (done) {
            request(app)
                .delete(route)
                .expect('Content-Type', /json/)
                .expect(200, /successfully/i, done);
        });
    });

    describe('When deleting non-existing user', function () {
        it('Returns http code 400 and JSON saying user was already gone', function (done) {
            request(app)
                .delete(route)
                .expect('Content-Type', /json/)
                .expect(400, /gone/i, done);
        });
    });
});
