const convert = require('../lib/convert');
const mj = require('mathjs');
const t = require('tap');

t.test('check out mathjs library first', function(t) {
  t.equal(mj.compare(mj.eval('sqrt(3^2 + 4^2)'), 5.0), 0,
    'mathjs returns a correct real number for sqrt(3^2 + 4^2).');
  const a = mj.eval('sqrt(-4)');
  t.assert(a.re === 0 && a.im == 2,
    'mathjs returns a correct imaginary number for sqrt(-4).');
  const b = mj.eval('2 inch to cm');
  t.equal(mj.compare(b.value, .0508), 0,
    'mathjs returns a correct conversion result for "2 inch to cm".');
  t.equal(mj.compare(mj.eval('cos(45 deg)'), .7071067811865476), 0,
    'mathjs returns a correct real number for cos(45 deg).');
  t.end();
});

/**
 * Positive cases -- Supported
 */
t.test('convert positive - degree', function(t) {
  const converted = convert.toSI('degree');
  t.comment(converted);
  t.assert(converted !== null, 'converted returns non-null value.');
  t.type(converted , 'object', 'converted returns an object.');
  t.assert(converted.unit_name !== null, 'unit_name returns non-null value.');
  t.type(converted.unit_name, 'string', 'unit_name is a string type.');
  t.equal(converted.unit_name, 'rad', 'unit_name returns correct result.');
  t.assert(converted.multiplication_factor !== null,
    'multiplication_factor returns non-null value.');
  t.type(converted.multiplication_factor, 'number',
    'multiplication_factor is a number type.');
  t.equal(mj.compare(converted.multiplication_factor, 0.017453292519943295), 0,
    'multiplication_factor is correct real number.');
  t.end();
});

t.test('convert positive - (degree/minute)', function(t) {
  const converted = convert.toSI('(degree/minute)');
  t.comment(converted);
  t.assert(converted !== null, 'converted returns non-null value.');
  t.type(converted , 'object', 'converted returns an object.');
  t.assert(converted.unit_name !== null, 'unit_name returns non-null value.');
  t.type(converted.unit_name, 'string', 'unit_name is a string type.');
  t.equal(converted.unit_name, 'rad/s', 'unit_name returns correct result.');
  t.assert(converted.multiplication_factor !== null,
    'multiplication_factor returns non-null value.');
  t.type(converted.multiplication_factor, 'number',
    'multiplication_factor is a number type.');
  t.equal(mj.compare(converted.multiplication_factor, 0.0002908882086657216), 0,
    'multiplication_factor is correct real number.');
  t.end();
});

t.test('convert positive - ha/L', function(t) {
  const converted = convert.toSI('ha/L');
  t.comment(converted);
  t.assert(converted !== null, 'converted returns non-null value.');
  t.type(converted , 'object', 'converted returns an object.');
  t.assert(converted.unit_name !== null, 'unit_name returns non-null value.');
  t.type(converted.unit_name, 'string', 'unit_name is a string type.');
  t.equal(converted.unit_name, 'm2/m3', 'unit_name returns correct result.');
  t.assert(converted.multiplication_factor !== null,
    'multiplication_factor returns non-null value.');
  t.type(converted.multiplication_factor, 'number',
    'multiplication_factor is a number type.');
  t.equal(mj.compare(converted.multiplication_factor, 10000000.), 0,
    'multiplication_factor is correct real number.');
  t.end();
});

/**
 * Negative cases -- Supported
 */

t.test('convert negative - paren imbalance - ((degree/minute)', function(t) {
  const converted = convert.toSI('((degree/minute');
  t.comment(converted);
  t.notEqual(converted, null, 'converted returns non-null value.');
  t.type(converted , 'object', 'converted returns an object.');
  t.equal(converted.unit_name, null, 'unit_name returns null.');
  t.end();
});

/**
 * Negative cases -- Invalid input
 */

t.test('convert negative - bogus string - ][fdsd#$%', function(t) {
  const converted = convert.toSI('][fdsd#$%');
  t.comment(converted);
  t.assert(converted !== null, 'converted returns non-null value.');
  t.type(converted , 'object', 'converted returns an object.');
  t.equal(converted.unit_name , null, 'unit_name returns null value.');
  t.end();
});

// 'ha*°' is valid format, but not supported yet
// For detail, see lib/convert.js
t.test('convert negative - ha*°', function(t) {
  const converted = convert.toSI('ha*°');
  t.comment(converted);
  t.assert(converted !== null, 'converted returns non-null value.');
  t.type(converted , 'object', 'converted returns an object.');
  t.equal(converted.unit_name , null, 'unit_name returns null value.');
  t.end();
});

/**
 * Negative cases -- Valid but Un-supported
 */

t.test('convert negative - too many elements - (degree/(minute*hectare))', function(t) {
  const converted = convert.toSI('(degree/(minute*hectare))');
  t.comment(converted);
  t.assert(converted !== null, 'converted returns non-null value.');
  t.type(converted , 'object', 'converted returns an object.');
  t.assert(converted.unit_name === '', 'unit_name returns empty string.');
  t.end();
});
