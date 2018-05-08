const mj = require('mathjs');
const path = require('path');
const request = require('request');
const server = require('../lib/server');
const t = require('tap');
const uuid = require('uuid');
const urlencode = require('urlencode');

const baseUrl = 'http://localhost:3000/';
const cmd = 'units/si/';
const method = 'get';

server.startServer(() => {

  t.test('server started', (t) => {
      t.pass('server started');
      t.end()
    });

  t.test('rest api test', (t) => {

    function subtest(units, callback) {
      request(
        {
          method: method,
          url: baseUrl + cmd + '?units=' + urlencode(units),
        }, (err, response, body) => {
          if (callback) callback(err, response, body);
        });
    }

    var parsed = null;
    function parseJson(str) {
      parsed = JSON.parse(str);
    }

    t.test('convert subtest - (degree/minute)', (t) => {
      subtest('(degree/minute)', (err, response, body) => {
        t.equal(err, null, method  + ' no errors.');
        t.equal(response.statusCode, 200, method  + ' returns right status code 200.');
        t.notEqual(body, null, method  + ' non-empty body.');
        t.doesNotThrow(parseJson.bind(null, body));
        t.comment(parsed)
        t.equal(parsed.unit_name, 'rad/s', method  + ' returns right unit_name.');
        t.equal(mj.compare(parsed.multiplication_factor, 0.0002908882086657216), 0,
          'mathjs returns a correct real number for (degree/minute).');
        t.notEqual(response, null, method  + ' non-null status.');
        t.end();
      });
    });

    t.test('convert subtest - ][fdsd#$%', (t) => {
      subtest('][fdsd#$%', (err, response, body) => {
        t.equal(err, null, method  + ' no errors.');
        t.equal(response.statusCode, 400, method  + ' returns right status code 400.');
        t.notEqual(body, null, method  + ' non-empty body.');
        t.comment(body);
        t.notEqual(response, null, method  + ' non-null status.');
        t.end();
      });
    });

    t.test('convert subtest - (degree/(minute*hectare))', (t) => {
      subtest('(degree/(minute*hectare))', (err, response, body) => {
        t.equal(err, null, method  + ' no errors.');
        t.equal(response.statusCode, 500, method  + ' returns right status code 500.');
        t.notEqual(body, null, method  + ' non-empty body.');
        t.comment(body)
        t.notEqual(response, null, method  + ' non-null status.');
        t.end();
        process.exit();
      });
    });

    t.end();
  });
});
