'use strict';
let request = require('supertest');
let app = require('./../js/app');

describe('Requests root path', function () {
    const route = '/';

    it('Returns status code 200', function (done) {
        request(app)
            .get(route)
            .expect(200, done);
    });

    it('Returns HTML', function (done) {
        request(app)
            .get(route)
            .expect('Content-Type', /html/, done);
    });
});
