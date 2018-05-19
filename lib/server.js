'use strict';

const bodyParser = require('body-parser');
const convert = require('./convert');
const express = require('express');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const msgServerError = 'Conversion server error occurred.';
const msgServerUnsupported = 'Units format unsupported.';
const msgUnitsFormatInvalid = 'Units format invalid.';
/*
curl -i http://localhost:3000/units/si/?units="(degree/minute)"
*/
app.get('/units/si', function(req, res) {
  let units = req.query.units;
  let converted = convert.toSI(units);
  switch (converted) {
    case undefined:
    case null:
      res.status(500).send(msgServerError);
      break;
    default:
      if (typeof converted === 'object') {
        if (converted.unit_name === null) {
          res.status(400).send(msgUnitsFormatInvalid);
          break;
        }
        if (converted.unit_name === '') {
          res.status(500).send(msgServerUnsupported);
          break;
        }
        try {
          converted = JSON.stringify(converted);
        } catch (e) {
          res.status(500).send(msgServerError);
          break;
        }
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(converted);
  }
});

function startServer(port, callback) {
  let p = port || 3000;
  app.listen(p,
    () => {
      if (callback) callback();
    }
  );
};

exports.startServer = startServer;
